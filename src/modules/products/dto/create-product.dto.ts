import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ProductType } from 'src/common/enums/product-type.enum';

export class CreateProductDto {
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
  @IsBoolean({ message: 'isTimeBased must be true or false' })
  isTimeBased?: boolean;

  @IsNotEmpty({ message: 'Price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(ProductType, {
    message: 'Type must be one of: material, labor, part, fee, or other',
  })
  type: ProductType;
}
