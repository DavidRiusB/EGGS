import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserUpdateDto } from './user-update.dto';
import { User } from './entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(pagination: { page: number; limit: number }) {
    return await this.userRepository.findAll(pagination);
  }

  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unexpected error while retrieving user',
      );
    }
  }

  async update(id: number, userData: UserUpdateDto): Promise<User> {
    try {
      const user = await this.findUserById(id);

      Object.assign(user, userData);

      return await this.userRepository.update(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unexpected error while updating user',
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Unexpected error while retrieving user by email`,
      );
    }
  }

  async findByTelephone(telephone: string): Promise<User> {
    try {
      const user = await this.userRepository.findByTelephone(telephone);

      if (!user) {
        throw new NotFoundException(
          `User with telephone ${telephone} not found`,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Unexpected error while retrieving user by telephone`,
      );
    }
  }
}
