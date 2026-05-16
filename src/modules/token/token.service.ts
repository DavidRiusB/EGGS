import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
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

  private getRepo(manager?: EntityManager): Repository<Token> {
    return manager ? manager.getRepository(Token) : this.tokenRepository;
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async createToken(
    user: User,
    type: TokenType,
    ttlMinutes: number,
    manager?: EntityManager,
  ): Promise<string> {
    await this.invalidateActiveTokens(user.id, type, manager);

    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = this.hash(plainToken);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);

    const repo = this.getRepo(manager);
    const tokenEntity = repo.create({
      tokenHash,
      type,
      user,
      expiresAt,
      usedAt: null,
    });
    await repo.save(tokenEntity);

    return plainToken;
  }

  async validateToken(
    plainToken: string,
    type: TokenType,
    manager?: EntityManager,
  ): Promise<Token | null> {
    const tokenHash = this.hash(plainToken);
    const repo = this.getRepo(manager);

    const token = await repo.findOne({
      where: { tokenHash, type },
      relations: ['user'],
    });

    if (!token) return null;
    if (token.usedAt) return null;
    if (token.expiresAt < new Date()) return null;

    return token;
  }

  async consumeToken(token: Token, manager?: EntityManager): Promise<void> {
    token.usedAt = new Date();
    await this.getRepo(manager).save(token);
  }

  async invalidateActiveTokens(
    userId: number,
    type: TokenType,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepo(manager);
    await repo
      .createQueryBuilder()
      .update(Token)
      .set({ usedAt: new Date() })
      .where('userId = :userId', { userId })
      .andWhere('type = :type', { type })
      .andWhere('usedAt IS NULL')
      .execute();
  }
}
