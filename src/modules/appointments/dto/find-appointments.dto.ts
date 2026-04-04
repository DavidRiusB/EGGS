import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

export class FindAppointmentsDto {
  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid ISO date (YYYY-MM-DD)' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  date?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @Transform(({ value }) => (value === '' ? undefined : value))
  startDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @Transform(({ value }) => (value === '' ? undefined : value))
  endDate?: string;

  @IsOptional()
  @IsEnum(AppointmentSlot, {
    message: 'Slot must be a valid appointment slot',
  })
  slot?: AppointmentSlot;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'User ID must be an integer' })
  @Min(1, { message: 'User ID must be greater than 0' })
  userId?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'Status must be a valid appointment status',
  })
  status?: AppointmentStatus;

  @IsOptional()
  @Type(() => Number) // 🔥 transforms string → number
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;
}
