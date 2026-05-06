// src/appointments/dto/get-availability.dto.ts
import { IsDateString, IsOptional } from 'class-validator';

export class GetAvailabilityDto {
  @IsOptional()
  @IsDateString() // accepts "2026-05-06" or full ISO
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
