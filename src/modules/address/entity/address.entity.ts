import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { State } from 'src/common/enums/states.enums';
import { Location } from 'src/common/interfaces/location.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'addresses' })
export class Address {
  @ApiProperty({ description: 'Auto-generated address ID.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Street number.', example: 1234 })
  @Column({ type: 'int' })
  number: number;

  @ApiPropertyOptional({
    description: 'Cardinal direction prefix (N, S, E, W, etc.).',
    enum: CardinalDirection,
  })
  @Column({ type: 'enum', enum: CardinalDirection, nullable: true })
  cardinalDirection?: CardinalDirection;

  @ApiProperty({ description: 'Street name.', example: 'Main' })
  @Column()
  streetName: string;

  @ApiProperty({
    description: 'Street suffix (St, Ave, Blvd, etc.).',
    enum: AddressSuffix,
  })
  @Column({ type: 'enum', enum: AddressSuffix })
  suffix: AddressSuffix;

  @ApiProperty({ description: 'City name.', example: 'Salt Lake City' })
  @Column()
  city: string;

  @ApiProperty({ description: 'US state.', enum: State })
  @Column({ type: 'enum', enum: State })
  state: State;

  @ApiProperty({ description: 'Zip code.', example: '84101' })
  @Column({ length: 10 })
  zipCode: string;

  @ApiPropertyOptional({
    description: 'Free-form notes (apartment, gate code, etc.).',
    example: 'Apt 4B',
  })
  @Column({ nullable: true, length: 500 })
  notes?: string;

  @ApiProperty({
    description: 'Marks this address as the user primary address.',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Index()
  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: User;

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
    description: 'Soft-delete timestamp; null when the address is active.',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
