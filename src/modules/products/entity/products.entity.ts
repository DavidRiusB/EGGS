import { ProductType } from 'src/common/enums/product-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'Auto-generated product ID.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Product name.', example: 'Screen replacement' })
  @Column({ length: 150, unique: true })
  name: string;

  @ApiProperty({
    description: 'Product description.',
    example: 'OEM-grade replacement screen for iPhone 15.',
  })
  @Column({ length: 500 })
  description: string;

  @ApiProperty({
    description: 'Whether the product is billed by time (e.g. labor).',
    example: false,
  })
  @Column({ default: false })
  isTimeBased: boolean;

  @ApiProperty({
    description: 'Product category.',
    enum: ProductType,
    example: ProductType.OTHER,
  })
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.OTHER,
  })
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

  @ApiPropertyOptional({
    description: 'Soft-delete timestamp; null when the product is active.',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
