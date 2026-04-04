import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { AppointmentsRepository } from './appointments.repository';
import { DataSource } from 'typeorm';
import { Appointment } from './entity/appointment.entity';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UserRepository } from '../user/user.repository';
import { RepairRepository } from '../repairs/repairs.repository';
import { User } from '../user/entity/user.entity';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly userRepository: UserRepository,
    private readonly repairRepository: RepairRepository,
    private readonly dataSource: DataSource,
  ) {}

  updateAppointment(id: number, data: any, user) {
    throw new Error('Method not implemented.');
  }

  async createAppointment(
    data: CreateAppointmentDto,
    userAuth,
  ): Promise<Appointment> {
    const { date, slot, userId, repairId, notes } = data;
    if (userAuth.role !== Role.Admin && userAuth.id !== data.userId) {
      throw new ForbiddenException(
        'You can only create appointments for your own user',
      );
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        // 🔹 1. Validate user
        const user = await this.userRepository.findById(userId, manager);

        if (!user) {
          throw new NotFoundException(`User with id: ${userId} not found`);
        }

        const repair =
          repairId !== undefined
            ? await this.repairRepository.findById(repairId, manager)
            : undefined;

        if (repairId && !repair) {
          throw new NotFoundException(`Repair with id: ${repairId} not found`);
        }

        // 🔹 3. Create appointment
        const appointment = manager.create(Appointment, {
          date,
          slot,
          user,
          repair: repair ?? undefined,
          notes,
        });

        // 🔹 4. Save (this is where unique constraint may explode)
        return await manager.save(appointment);
      });
    } catch (error: any) {
      // 🔥 Handle unique constraint (slot already taken)
      if (error.code === '23505') {
        throw new BadRequestException(
          `The slot ${slot} on ${date} is already booked`,
        );
      }

      throw error;
    }
  }

  async findById(id: number, user: User): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.getById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with id: ${id} not found`);
    }
    if (user.role !== Role.Admin && user.id !== appointment.user.id) {
      throw new ForbiddenException('You can only access your own appointments');
    }
    return appointment;
  }

  async findAppointments(
    query: FindAppointmentsDto,
    user: User,
  ): Promise<{ data: Appointment[]; total: number }> {
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }
    }
    const filters = {
      ...query,
      userId: user.role === Role.Admin ? query.userId : user.id,
    };
    return this.appointmentsRepository.findWithFilters(filters);
  }

  async cancelAppointment(id: number, user: User): Promise<Appointment> {
    return this.dataSource.transaction(async (manager) => {
      const appointment = await this.appointmentsRepository.getById(
        id,
        manager,
      );

      if (!appointment) {
        throw new NotFoundException(`Appointment with id: ${id} not found`);
      }
      if (user.role !== Role.Admin && user.id !== appointment.user.id) {
        throw new ForbiddenException(
          'You can only cancel your own appointments',
        );
      }

      if (appointment.status === AppointmentStatus.CANCELLED) {
        throw new BadRequestException('Appointment already cancelled');
      }

      if (appointment.status === AppointmentStatus.COMPLETED) {
        throw new BadRequestException('Cannot cancel a completed appointment');
      }

      appointment.status = AppointmentStatus.CANCELLED;

      return await manager.save(appointment);
    });
  }
}
