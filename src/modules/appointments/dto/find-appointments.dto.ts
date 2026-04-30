import {
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';

export class FindAppointmentsDto {
  @ApiPropertyOptional({
    description: 'Exact date filter (ISO YYYY-MM-DD).',
    example: '2026-05-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid ISO date (YYYY-MM-DD)' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  date?: string;

  @ApiPropertyOptional({
    description: 'Lower bound of date range (ISO YYYY-MM-DD).',
    example: '2026-05-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @Transform(({ value }) => (value === '' ? undefined : value))
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Upper bound of date range (ISO YYYY-MM-DD).',
    example: '2026-05-31',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO date (YYYY-MM-DD)' },
  )
  @Transform(({ value }) => (value === '' ? undefined : value))
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by appointment slot.',
    enum: AppointmentSlot,
  })
  @IsOptional()
  @IsEnum(AppointmentSlot, {
    message: 'Slot must be a valid appointment slot',
  })
  slot?: AppointmentSlot;

  @ApiPropertyOptional({
    description: 'Filter by user ID.',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'User ID must be an integer' })
  @Min(1, { message: 'User ID must be greater than 0' })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Filter by appointment status.',
    enum: AppointmentStatus,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'Status must be a valid appointment status',
  })
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Page number (1-indexed).',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number) // 🔥 transforms string → number
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page.',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;
}
