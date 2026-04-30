import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { RepairStatus } from 'src/common/enums/repair-status.enum';
import { Address } from 'src/modules/address/entity/address.entity';
import { Appointment } from 'src/modules/appointments/entity/appointment.entity';
import { RepairDetail } from 'src/modules/repair-details/entity/repair-detail.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'repairs' })
export class Repair {
  @ApiProperty({ description: 'Auto-generated repair ID.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Appointment, (appointment) => appointment.repair, {
    nullable: true,
  })
  appointment?: Appointment;

  @ApiProperty({
    description: 'Date the repair was created.',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.repairs)
  user: User;

  @OneToMany(() => RepairDetail, (detail) => detail.repair, {
    cascade: true,
  })
  details: RepairDetail[];

  @ApiProperty({
    description: 'Workflow status.',
    enum: RepairStatus,
    example: RepairStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING,
  })
  status: RepairStatus;

  @ApiProperty({
    description: 'Total repair price (decimal stored as string).',
    example: '249.99',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @ApiPropertyOptional({
    description: 'Optional ID of the coupon applied to the repair.',
    example: 7,
  })
  @Column({
    nullable: true,
  })
  couponId?: number;

  @ApiPropertyOptional({
    description: 'Discount amount applied (decimal stored as string).',
    example: '25.00',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountAmount?: string;

  @ApiProperty({
    description: 'Payment method used for the repair.',
    enum: PaymentMethod,
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => Address)
  address: Address;

  @ApiPropertyOptional({
    description: 'Soft-delete timestamp; null when the repair is active.',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
