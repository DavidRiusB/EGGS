import { PartialType } from '@nestjs/mapped-types';
import { AddressDto } from './address.dto';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { State } from 'src/common/enums/states.enums';

export class UpdateAddressDto extends PartialType(AddressDto) {
  @ApiPropertyOptional({ description: 'Street number.', example: 1234 })
  @IsOptional()
  @IsNumber({}, { message: 'Address number must be a valid number' })
  number?: number;

  @ApiPropertyOptional({
    description: 'Cardinal direction prefix (N, S, E, W, etc.).',
    enum: CardinalDirection,
  })
  @IsOptional()
  @IsEnum(CardinalDirection, {
    message: 'Invalid cardinal direction',
  })
  cardinalDirection?: CardinalDirection;

  @ApiPropertyOptional({
    description: 'Street name.',
    example: 'Main',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Street name must be a string' })
  @MaxLength(100, {
    message: 'Street name must not exceed 100 characters',
  })
  streetName?: string;

  @ApiPropertyOptional({
    description: 'Street suffix (St, Ave, Blvd, etc.).',
    enum: AddressSuffix,
  })
  @IsOptional()
  @IsEnum(AddressSuffix, {
    message: 'Invalid address suffix',
  })
  suffix?: AddressSuffix;

  @ApiPropertyOptional({
    description: 'City name.',
    example: 'Salt Lake City',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, {
    message: 'City must not exceed 100 characters',
  })
  city?: string;

  @ApiPropertyOptional({ description: 'US state.', enum: State })
  @IsOptional()
  @IsEnum(State, {
    message: 'Invalid state value',
  })
  state?: State;

  @ApiPropertyOptional({
    description: 'Zip code (5-10 characters).',
    example: '84101',
    minLength: 5,
    maxLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Zip code must be a string' })
  @MinLength(5, {
    message: 'Zip code must be at least 5 characters',
  })
  @MaxLength(10, {
    message: 'Zip code must not exceed 10 characters',
  })
  zipCode?: string;

  @ApiPropertyOptional({
    description: 'Free-form notes (apartment, gate code, etc.).',
    example: 'Apt 4B',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, {
    message: 'Notes must not exceed 500 characters',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Marks this address as the user primary address.',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean value' })
  isPrimary?: boolean;
}
