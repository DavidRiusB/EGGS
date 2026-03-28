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
import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid ISO date (YYYY-MM-DD)' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  date: string;

  @IsNotEmpty({ message: 'Slot is required' })
  @IsEnum(AppointmentSlot, {
    message: `Slot must be one of: ${Object.values(AppointmentSlot).join(', ')}`,
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  slot: AppointmentSlot;

  @IsNotEmpty({ message: 'User ID is required' })
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber({}, { message: 'User ID must be a valid number' })
  userId: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsNumber({}, { message: 'Repair ID must be a valid number' })
  repairId?: number;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, {
    message: 'Notes cannot exceed 500 characters',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  notes?: string;
}
