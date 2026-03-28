import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';
import { AppointmentStatus } from 'src/common/enums/appointment-status.enum';
import { Repair } from 'src/modules/repairs/entity/repairs.entity';
import { User } from 'src/modules/user/entity/user.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  // 📅 Day of appointment
  @Column({ type: 'date' })
  date: string;

  // 🕒 Fixed slot
  @Column({
    type: 'enum',
    enum: AppointmentSlot,
  })
  slot: AppointmentSlot;

  // 🔄 Workflow status
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
  @Column({ type: 'text', nullable: true })
  notes?: string;

  // 🕓 audit fields
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
