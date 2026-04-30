import { ProductType } from 'src/common/enums/product-type.enum';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Auto-generated repair-detail ID.',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Detail name (snapshot of product name at time of repair).',
    example: 'Screen replacement',
  })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({
    description: 'Detail description.',
    example: 'OEM-grade replacement screen for iPhone 15.',
  })
  @Column({ length: 500 })
  description: string;

  @Index()
  @ManyToOne(() => Repair, (repair) => repair.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'repair_id' })
  repair: Repair;

  @ApiProperty({ description: 'Quantity of this line item.', example: 1 })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({
    description: 'Whether the detail is billed by time (e.g. labor).',
    example: false,
  })
  @Column({ default: false })
  isTimeBased: boolean;

  @ApiProperty({ description: 'Detail category.', enum: ProductType })
  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @ApiProperty({
    description: 'Unit price (decimal stored as string).',
    example: '199.99',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @ApiProperty({
    description: 'Line total (price * quantity, decimal stored as string).',
    example: '199.99',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: string;

  @ApiProperty({
    description: 'Creation timestamp.',
    type: String,
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp.',
    type: String,
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
