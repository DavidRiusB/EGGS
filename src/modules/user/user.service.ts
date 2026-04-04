import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserUpdateDto } from './dto/user-update.dto';
import { User } from './entity/user.entity';
import { Role } from 'src/common/enums/roles.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(pagination: {
    page: number;
    limit: number;
  }): Promise<{ data: User[]; total: number }> {
    return this.userRepository.findAll(pagination);
  }

  async findUserById(id: number, user: User): Promise<User> {
    const target = await this.userRepository.findById(id);

    if (!target) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.role !== Role.Admin && user.id !== target.id) {
      throw new ForbiddenException('You can only access your own user');
    }

    return target;
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

  async update(id: number, userData: UserUpdateDto, user: User): Promise<User> {
    const target = await this.findUserById(id, user);

    Object.assign(target, userData);

    return this.userRepository.update(target);
  }

  async updateUserRole(id: number, role: Role): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.role === role) {
      return user; // no change
    }

    user.role = role;

    return this.userRepository.updateUserRole(user);
  }

  async softDelete(id: number, user: User): Promise<void> {
    const target = await this.findUserById(id, user);

    const result = await this.userRepository.softDelete(target.id);

    if (!result.affected) {
      throw new InternalServerErrorException(
        `Failed to delete user with id ${id}`,
      );
    }
  }
}
