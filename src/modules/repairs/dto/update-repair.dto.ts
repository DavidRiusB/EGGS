import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { RepairStatus } from 'src/common/enums/repair-status.enum';

export class UpdateRepairDto {
  @ApiPropertyOptional({
    description: 'New repair status.',
    enum: RepairStatus,
  })
  @IsOptional()
  @IsEnum(RepairStatus, {
    message: 'status must be a valid RepairStatus value',
  })
  status?: RepairStatus;

  @ApiPropertyOptional({
    description: 'New payment method.',
    enum: PaymentMethod,
  })
  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'paymentMethod must be a valid PaymentMethod value',
  })
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'ID of the address tied to the repair.',
    example: 1,
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: 'addressId must be a valid number',
    },
  )
  addressId?: number;
}
