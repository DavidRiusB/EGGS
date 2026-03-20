import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { State } from 'src/common/enums/states.enums';
import { Location } from 'src/common/interfaces/location.interface';

import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'enum', enum: CardinalDirection, nullable: true })
  cardinalDirection?: CardinalDirection;

  @Column()
  streetName: string;

  @Column({ type: 'enum', enum: AddressSuffix })
  suffix: AddressSuffix;

  @Column()
  city: string;

  @Column({ type: 'enum', enum: State })
  state: State;

  @Column({ length: 10 })
  zipCode: string;

  @Column({ nullable: true, length: 500 })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Index()
  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
