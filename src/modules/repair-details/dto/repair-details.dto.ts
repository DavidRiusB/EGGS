import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
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

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsOptional()
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(RepairDetailType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type: RepairDetailType;
}
