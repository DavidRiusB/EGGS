import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserUpdateDto } from './user-update.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(pagination: { page: number; limit: number }) {
    return this.userRepository.findAll(pagination);
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findByTelephone(telephone: string): Promise<User> {
    const user = await this.userRepository.findByTelephone(telephone);

    if (!user) {
      throw new NotFoundException(`User with telephone ${telephone} not found`);
    }

    return user;
  }

  async update(id: number, userData: UserUpdateDto): Promise<User> {
    const user = await this.findUserById(id);

    Object.assign(user, userData);

    return this.userRepository.update(user);
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
