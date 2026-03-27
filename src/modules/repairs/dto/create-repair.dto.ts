import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { ProductRefDto } from 'src/modules/products/dto/product-ref.dto';

export class CreateRepairDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;

  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ProductRefDto)
  items: ProductRefDto[];

  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be a valid enum value',
  })
  paymentMethod: PaymentMethod;
}
