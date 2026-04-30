import { Role } from 'src/common/enums/roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
import { Appointment } from 'src/modules/appointments/entity/appointment.entity';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ description: 'Auto-generated user ID.', example: 1 })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: 'User role.', enum: Role, example: Role.User })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @ApiProperty({ description: 'First name.', example: 'John' })
  @Column({ length: 50 })
  firstName: string;

  @ApiProperty({ description: 'Last name.', example: 'Doe' })
  @Column({ length: 50 })
  lastName: string;

  @ApiProperty({
    description: 'User email address.',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true, length: 50 })
  email: string;

  @ApiProperty({ description: 'Telephone number.', example: '8015551234' })
  @Column({ length: 20 })
  telephone: string;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => Repair, (repair) => repair.user)
  repairs: Repair[];

  @ApiPropertyOptional({
    description: 'Soft-delete timestamp; null when the user is active.',
    type: String,
    format: 'date-time',
    nullable: true,
  })
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
