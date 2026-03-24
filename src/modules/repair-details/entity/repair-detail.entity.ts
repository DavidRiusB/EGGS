import { ProductType } from 'src/common/enums/product-type.enum';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'repair_details' })
export class RepairDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Index()
  @ManyToOne(() => Repair, (repair) => repair.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'repair_id' })
  repair: Repair;

  @Column({ default: 1 })
  quantity: number;

  @Column({ default: false })
  isTimeBased: boolean;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
