import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';

export class CreateRepairDetailDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters',
  })
  description: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Hours must be a number' })
  @Min(0, { message: 'Hours cannot be negative' })
  hours?: number;

  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsOptional()
  @IsEnum(RepairDetailType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type?: RepairDetailType;
}
