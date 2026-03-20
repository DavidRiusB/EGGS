import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './entities/auth.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
    private readonly userService: UserService,
  ) {}

  async create(
    data: {
      user: User;
      email: string;
      password: string;
    },
    manager?: EntityManager,
  ): Promise<Credential> {
    try {
      const repo = manager
        ? manager.getRepository(Credential)
        : this.credentialRepository;

      const newCredential = repo.create(data);

      return await repo.save(newCredential);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findByEmail(email: string): Promise<Credential | null> {
    return await this.credentialRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['user'],
    });
  }
}
