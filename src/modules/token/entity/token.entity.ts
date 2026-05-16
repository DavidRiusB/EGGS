import { User } from 'src/modules/user/entity/user.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  // SHA-256 hash of the real token. The plaintext token is only ever
  // in the email link — never stored.
  @Index()
  @Column()
  tokenHash: string;

  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  // Set when the token is consumed. Single-use enforcement.
  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
