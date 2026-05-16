import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import { Token } from './entity/token.entity';
import { TokenType } from 'src/common/enums/token-type.enum';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Creates a token for a user. Returns the PLAINTEXT token
   * (to put in the email link). Only the hash is stored.
   */
  async createToken(
    user: User,
    type: TokenType,
    ttlMinutes: number,
  ): Promise<string> {
    // Invalidate any existing active tokens of this type for this user
    // so old links stop working when a new one is issued.
    await this.invalidateActiveTokens(user.id, type);

    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hash(plainToken);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

    const tokenEntity = this.tokenRepository.create({
      tokenHash,
      type,
      user,
      expiresAt,
      usedAt: null,
    });
    await this.tokenRepository.save(tokenEntity);

    return plainToken;
  }

  /**
   * Validates a plaintext token. Returns the Token row (with user)
   * if valid, or null if invalid/expired/used.
   */
  async validateToken(
    plainToken: string,
    type: TokenType,
  ): Promise<Token | null> {
    const tokenHash = this.hash(plainToken);

    const token = await this.tokenRepository.findOne({
      where: { tokenHash, type },
      relations: ['user'],
    });

    if (!token) return null;
    if (token.usedAt) return null;
    if (token.expiresAt < new Date()) return null;

    return token;
  }

  /**
   * Marks a token as consumed. Single-use enforcement.
   */
  async consumeToken(token: Token): Promise<void> {
    token.usedAt = new Date();
    await this.tokenRepository.save(token);
  }

  /**
   * Invalidates all active tokens of a type for a user.
   * Used before issuing a new one (resend).
   */
  async invalidateActiveTokens(userId: number, type: TokenType): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .update(Token)
      .set({ usedAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('type = :type', { type })
      .andWhere('usedAt IS NULL')
      .execute();
  }
}
