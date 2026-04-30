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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from 'src/common/enums/product-type.enum';

export class CreateRepairDetailDto {
  @ApiProperty({
    description: 'Detail name (snapshot of product name at time of repair).',
    example: 'Screen replacement',
    maxLength: 150,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name: string;

  @ApiProperty({
    description: 'Detail description.',
    example: 'OEM-grade replacement screen for iPhone 15.',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters',
  })
  description: string;

  @ApiProperty({
    description: 'Quantity of this line item.',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @ApiPropertyOptional({
    description: 'Whether the detail is billed by time (e.g. labor).',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @ApiProperty({
    description: 'Unit price (snapshot of product price at time of repair).',
    example: 199.99,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @ApiProperty({
    description: 'Detail category.',
    enum: ProductType,
  })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(ProductType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type: ProductType;
}
