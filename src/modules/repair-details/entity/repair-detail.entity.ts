import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';
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

  @Column({ length: 150, unique: true })
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

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  hours?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @Column({
    type: 'enum',
    enum: RepairDetailType,
    default: RepairDetailType.OTHER,
  })
  type: RepairDetailType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
