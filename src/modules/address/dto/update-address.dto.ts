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
  IsPostalCode,
} from 'class-validator';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { State } from 'src/common/enums/states.enums';

export class UpdateAddressDto extends PartialType(AddressDto) {
  @IsOptional()
  @IsNumber({}, { message: 'Address number must be a valid number' })
  number?: number;

  @IsOptional()
  @IsEnum(CardinalDirection, {
    message: 'Invalid cardinal direction',
  })
  cardinalDirection?: CardinalDirection;

  @IsOptional()
  @IsString({ message: 'Street name must be a string' })
  @MaxLength(100, {
    message: 'Street name must not exceed 100 characters',
  })
  streetName?: string;

  @IsOptional()
  @IsEnum(AddressSuffix, {
    message: 'Invalid address suffix',
  })
  suffix?: AddressSuffix;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(100, {
    message: 'City must not exceed 100 characters',
  })
  city?: string;

  @IsOptional()
  @IsEnum(State, {
    message: 'Invalid state value',
  })
  state?: State;

  @IsOptional()
  @IsString({ message: 'Zip code must be a string' })
  @MinLength(5, {
    message: 'Zip code must be at least 5 characters',
  })
  @MaxLength(10, {
    message: 'Zip code must not exceed 10 characters',
  })
  zipCode?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  @MaxLength(500, {
    message: 'Notes must not exceed 500 characters',
  })
  notes?: string;

  @IsOptional()
  @IsBoolean({ message: 'isPrimary must be a boolean value' })
  isPrimary?: boolean;
}
