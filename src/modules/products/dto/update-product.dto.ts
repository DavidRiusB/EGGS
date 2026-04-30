import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from 'src/common/enums/product-type.enum';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name.',
    example: 'Screen replacement',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name must not exceed 150 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description.',
    example: 'OEM-grade replacement screen for iPhone 15.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, {
    message: 'Description must not exceed 500 characters',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the product is billed by time (e.g. labor).',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @ApiPropertyOptional({
    description: 'Unit price.',
    example: 199.99,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Product category.',
    enum: ProductType,
  })
  @IsOptional()
  @IsEnum(ProductType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type?: ProductType;
}
