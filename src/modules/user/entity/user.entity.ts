import { Role } from "src/enums/roles.enum";

import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";

import { Address } from "src/modules/address/entity/address.entity";
import { Repair } from "src/modules/repairs/entity/repairs.entity";

@Entity({ name: "users" })
export class User {

  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: number;

  @Column({ unique: true, length: 30 })
  username: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephone: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

 @OneToMany(() => Repair, (repair) => repair.user)
  repairs: Repair[];

  @DeleteDateColumn({
    type: "timestamp",
    nullable: true,
  })
  deletedAt?: Date;

  //@OneToMany(() => Discount, (discount) => discount.user)
  //discounts: Discount[];
}