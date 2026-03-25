import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ProductRefDto } from 'src/modules/products/dto/product-ref.dto';

export class CreateRepairDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @IsArray({ message: 'Details must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductRefDto)
  items: ProductRefDto[];
}
