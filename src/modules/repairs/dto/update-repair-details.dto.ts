import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductRefDto } from 'src/modules/products/dto/product-ref.dto';

export class UpdateRepairDetailsDto {
  @ApiProperty({
    description: 'Replacement set of line items for the repair.',
    type: [ProductRefDto],
  })
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductRefDto)
  items: ProductRefDto[];
}
