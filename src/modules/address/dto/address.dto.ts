import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  MaxLength,
  IsBoolean,
} from 'class-validator';

import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { State } from 'src/common/enums/states.enums';

export class AddressDto {
  @IsNumber()
  number: number;

  @IsOptional()
  @IsEnum(CardinalDirection)
  cardinalDirection?: CardinalDirection;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  streetName: string;

  @IsEnum(AddressSuffix)
  suffix: AddressSuffix;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city: string;

  @IsEnum(State)
  state: State;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  zipCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
