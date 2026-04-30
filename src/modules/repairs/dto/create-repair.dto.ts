import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { ProductRefDto } from 'src/modules/products/dto/product-ref.dto';

export class CreateRepairDto {
  @ApiProperty({
    description: 'ID of the user the repair belongs to.',
    example: 1,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @ApiProperty({
    description: 'Line items (products + quantities) included in the repair.',
    type: [ProductRefDto],
  })
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductRefDto)
  items: ProductRefDto[];

  @ApiProperty({
    description: 'Payment method used for the repair.',
    enum: PaymentMethod,
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be a valid enum value',
  })
  paymentMethod: PaymentMethod;
}
