import {
  IsNotEmpty,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment date (ISO YYYY-MM-DD).',
    example: '2026-05-15',
  })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO date (YYYY-MM-DD)' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  date: string;

  @ApiProperty({
    description: 'Appointment time slot.',
    enum: AppointmentSlot,
  })
  @IsNotEmpty({ message: 'Slot is required' })
  @IsEnum(AppointmentSlot, {
    message: `Slot must be one of: ${Object.values(AppointmentSlot).join(', ')}`,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  slot: AppointmentSlot;

  @ApiProperty({
    description: 'ID of the user the appointment belongs to.',
    example: 1,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber({}, { message: 'User ID must be a valid number' })
  userId: number;

  @ApiPropertyOptional({
    description: 'Optional ID of the repair this appointment is for.',
    example: 42,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber({}, { message: 'Repair ID must be a valid number' })
  repairId?: number;

  @ApiPropertyOptional({
    description: 'Free-form notes for the appointment.',
    example: 'Customer prefers afternoon contact.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, {
    message: 'Notes cannot exceed 500 characters',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  notes?: string;
}
