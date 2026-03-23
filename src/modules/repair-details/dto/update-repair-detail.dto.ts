import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';

export class UpdateRepairDetailDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters',
  })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be greater than 0' })
  quantity?: number;

  @IsOptional()
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @IsEnum(RepairDetailType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type?: RepairDetailType;
}
