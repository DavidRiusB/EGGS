import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
