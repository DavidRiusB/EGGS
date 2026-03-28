import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { RepairStatus } from 'src/common/enums/repair-status.enum';
import { Address } from 'src/modules/address/entity/address.entity';
import { Appointment } from 'src/modules/appointments/entity/appointment.entity';
import { RepairDetail } from 'src/modules/repair-details/entity/repair-detail.entity';
import { User } from 'src/modules/user/entity/user.entity';

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
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Appointment, (appointment) => appointment.repair, {
    nullable: true,
  })
  appointment?: Appointment;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.repairs)
  user: User;

  @OneToMany(() => RepairDetail, (detail) => detail.repair, {
    cascade: true,
  })
  details: RepairDetail[];

  @Column({
    type: 'enum',
    enum: RepairStatus,
    default: RepairStatus.PENDING,
  })
  status: RepairStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @Column({
    nullable: true,
  })
  couponId?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  discountAmount?: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => Address)
  address: Address;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
