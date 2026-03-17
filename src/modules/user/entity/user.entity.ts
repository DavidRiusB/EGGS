import { Role } from 'src/enums/roles.enum';

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';

import { Address } from 'src/modules/address/entity/address.entity';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import { Credential } from 'src/modules/auth/entities/auth.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 30 })
  userName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 20 })
  telephone: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Repair, (repair) => repair.user)
  repairs: Repair[];

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToOne(() => Credential, (credential) => credential.user, {
    cascade: true,
  })
  credential: Credential;
}
