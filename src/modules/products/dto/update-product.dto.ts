import { PartialType } from '@nestjs/mapped-types';
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
import { ProductType } from 'src/common/enums/product-type.enum';
import { Product } from '../entity/products.entity';

export class UpdateProductDto {
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
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price?: number;

  @IsOptional()
  @IsEnum(ProductType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type?: ProductType;
}
