import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { RepairsModule } from '../repairs/repairs.module';
import { UserModule } from '../user/user.module';
import { AppointmentsRepository } from './appointments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), UserModule, RepairsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
