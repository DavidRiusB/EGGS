import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from '../auth/dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    const [data, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { data, total };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
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

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByTelephone(telephone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { telephone },
    });
  }
}
