import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { RepairStatus } from 'src/common/enums/repair-status.enum';

export class UpdateRepairDto {
  @IsOptional()
  @IsEnum(RepairStatus, {
    message: 'status must be a valid RepairStatus value',
  })
  status?: RepairStatus;

  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be a valid PaymentMethod value',
  })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'addressId must be a valid number',
    },
  )
  addressId?: number;
}
