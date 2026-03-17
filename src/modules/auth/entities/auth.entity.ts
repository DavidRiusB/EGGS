import { User } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'credentials' })
export class Credential {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // Optional depending on your use case
  @Column({ unique: true, length: 20 })
  SSN: string;

  // 🔥 Username for login
  @Column({ unique: true, length: 30 })
  userName: string;

  // 🔥 Used for login → MUST be selectable
  @Column({ unique: true, length: 50 })
  email: string;

  // 🔐 Hidden by default
  @Column({ length: 60, select: false })
  password: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;

  // 🔗 Relation to User
  @OneToOne(() => User, (user) => user.credential, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
