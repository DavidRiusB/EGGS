import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'repair_details' })
export class RepairDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Repair, (repair) => repair.details)
  @JoinColumn({ name: 'repair_id' })
  repair: Repair;

  @Column()
  buildingType: string;

  @Column({
    length: 500,
  })
  description: string;

  @Column({
    default: 1,
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;
}
