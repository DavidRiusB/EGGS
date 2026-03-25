import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class ProductRefDto {
  @IsNotEmpty({ message: 'Detail ID is required' })
  @IsNumber({}, { message: 'Detail ID must be a number' })
  productId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;
}
