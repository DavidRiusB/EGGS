import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductRefDto {
  @ApiProperty({
    description: 'ID of the product being referenced.',
    example: 1,
  })
  @IsNotEmpty({ message: 'Detail ID is required' })
  @IsNumber({}, { message: 'Detail ID must be a number' })
  productId: number;

  @ApiPropertyOptional({
    description: 'Quantity of the product (defaults to 1 when omitted).',
    example: 2,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;
}
