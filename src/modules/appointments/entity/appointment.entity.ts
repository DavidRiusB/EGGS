import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'appointments' })
@Index(['date', 'slot'], { unique: true }) // 🔒 prevent double booking
export class Appointment {
  @ApiProperty({ description: 'Auto-generated appointment ID.', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  // 📅 Day of appointment
  @ApiProperty({
    description: 'Appointment date (ISO YYYY-MM-DD).',
    example: '2026-05-15',
  })
  @Column({ type: 'date' })
  date: string;

  // 🕒 Fixed slot
  @ApiProperty({
    description: 'Appointment time slot.',
    enum: AppointmentSlot,
  })
  @Column({
    type: 'enum',
    enum: AppointmentSlot,
  })
  slot: AppointmentSlot;

  // 🔄 Workflow status
  @ApiProperty({
    description: 'Workflow status.',
    enum: AppointmentStatus,
    example: AppointmentStatus.SCHEDULED,
  })
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  // 👤 Who booked it
  @ManyToOne(() => User, (user) => user.appointments, {
    eager: false,
  })
  user: User;

  // 🔧 Related repair
  @OneToOne(() => Repair, {
    nullable: true,
    cascade: false,
  })
  @JoinColumn()
  repair?: Repair;

  // 📝 Optional notes (owner can fill later)
  @ApiPropertyOptional({
    description: 'Free-form notes for the appointment.',
    example: 'Customer prefers afternoon contact.',
  })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  // 🕓 audit fields
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
    description: 'Soft-delete timestamp; null when the appointment is active.',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  @DeleteDateColumn()
  deletedAt?: Date;
}
