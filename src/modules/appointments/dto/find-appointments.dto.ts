import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

export class FindAppointmentsDto {
  @IsOptional()
  @IsDateString()
  date?: string; // "" this is accepted

  @IsOptional()
  @IsDateString()
  startDate?: string; // "" this is accepted

  @IsOptional()
  @IsDateString()
  endDate?: string; // "" this is accepted

  @IsOptional()
  @IsEnum(AppointmentSlot)
  slot?: AppointmentSlot;

  @IsOptional()
  @IsNumber()
  userId?: number; // we are not checking properly for user are we ?

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
