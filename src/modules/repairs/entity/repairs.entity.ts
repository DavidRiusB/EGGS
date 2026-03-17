import { Address } from 'src/modules/address/entity/address.entity';
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
} from 'typeorm';

@Entity({ name: 'repairs' })
export class Repair {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.repairs)
  user: User;

  @OneToMany(() => RepairDetail, (detail) => detail.repair, {
    cascade: true,
  })
  details: RepairDetail[];

  @Column({
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

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
  couponDiscount?: number;

  @Column()
  paymentMethod: string;

  @ManyToOne(() => Address)
  address: Address;

  @DeleteDateColumn({
    nullable: true,
  })
  deletedAt?: Date;
}
