import { ProductType } from 'src/common/enums/product-type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ default: false })
  isTimeBased: boolean;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.OTHER,
  })
  type: ProductType;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
