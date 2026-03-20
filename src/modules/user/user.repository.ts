import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dto/register.dto';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(pagination: {
    page: number;
    limit: number;
  }): Promise<{ data: User[]; total: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return { data, total };
  }

  async findById(id: number, manager?: EntityManager): Promise<User | null> {
    const repo = manager ? manager.getRepository(User) : this.userRepository;
    return repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByTelephone(telephone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { telephone } });
  }

  async update(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User with provided data already exists');
      }

      throw new InternalServerErrorException(
        'Unexpected error while updating user',
      );
    }
  }

  async create(
    newUserData: RegisterUserDto,
    manager?: EntityManager,
  ): Promise<User> {
    try {
      const repo = manager ? manager.getRepository(User) : this.userRepository;

      const { userName, firstName, lastName, email, telephone } = newUserData;

      const newUser = repo.create({
        userName,
        firstName,
        lastName,
        email,
        telephone,
      });

      return await repo.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User with provided data already exists');
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async softDelete(id: number): Promise<DeleteResult> {
    return this.userRepository.softDelete(id);
  }
}
