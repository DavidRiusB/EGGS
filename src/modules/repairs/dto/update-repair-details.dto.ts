import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ProductRefDto } from 'src/modules/products/dto/product-ref.dto';

export class UpdateRepairDetailsDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductRefDto)
  items: ProductRefDto[];
}
