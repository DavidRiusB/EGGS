import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
  ) {}

  private getRepo(manager): Repository<Appointment> {
    return manager
      ? manager.getRepository(Appointment)
      : this.appointmentsRepository;
  }

  async findWithFilters(
    filters: FindAppointmentsDto,
    manager?: EntityManager,
  ): Promise<{ data: Appointment[]; total: number }> {
    const repo = this.getRepo(manager);

    const query = repo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect('appointment.repair', 'repair');

    if (filters.date !== undefined) {
      query.andWhere('appointment.date = :date', {
        date: filters.date,
      });
    }

    if (filters.startDate !== undefined) {
      query.andWhere('appointment.date >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate !== undefined) {
      query.andWhere('appointment.date <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters.slot !== undefined) {
      query.andWhere('appointment.slot = :slot', {
        slot: filters.slot,
      });
    }

    if (filters.userId !== undefined) {
      query.andWhere('user.id = :userId', {
        userId: filters.userId,
      });
    }

    if (filters.status !== undefined) {
      query.andWhere('appointment.status = :status', {
        status: filters.status,
      });
    }

    if (!filters.status) {
      query.andWhere('appointment.status != :cancelled', {
        cancelled: AppointmentStatus.CANCELLED,
      });
    }

    query
      .orderBy('appointment.date', 'ASC')
      .addOrderBy('appointment.slot', 'ASC');

    // ✅ pagination
    const offset = (filters.page - 1) * filters.limit;
    query.skip(offset).take(filters.limit);

    // ✅ get total + data
    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async getById(
    id: number,
    manager?: EntityManager,
  ): Promise<Appointment | null> {
    const repo = this.getRepo(manager);
    return repo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.user', 'user')
      .leftJoinAndSelect(
        'user.addresses',
        'address',
        'address.isPrimary = true',
      )
      .where('appointment.id = :id', { id })
      .getOne();
  }

  async softDelete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.softDelete(id);
  }

  async findBookedSlots(
    from: Date,
    to: Date,
    manager?: EntityManager,
  ): Promise<Appointment[]> {
    const repo = this.getRepo(manager);
    const query = repo
      .createQueryBuilder('appointment')
      .select(['appointment.date', 'appointment.slot'])
      .where('appointment.date >= :from', { from })
      .andWhere('appointment.date < :to', { to })
      // .andWhere('appointment.status != :cancelled', { cancelled: 'cancelled' })
      .getMany();

    return query;
  }

  // In AppointmentsRepository
  async create(
    data: Partial<Appointment>,
    manager?: EntityManager,
  ): Promise<Appointment> {
    const repo = this.getRepo(manager);
    const appointment = repo.create(data);
    return repo.save(appointment);
  }

  async update(
    appointment: Appointment,
    manager?: EntityManager,
  ): Promise<Appointment> {
    const repo = this.getRepo(manager);
    return repo.save(appointment);
  }
}
