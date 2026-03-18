import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { RegisterUserDTO } from './dto/register.dto';
import { hashPassword } from 'src/common/utils/hashing/bycryp.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(data: RegisterUserDTO) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // 🔐 1. hash password
        const hashedPassword = await hashPassword(data.password);
        // 👤 2. create user
        const user = await this.userRepository.create(data, manager);
        // 🔑 3. create credential
        await this.authRepository.create(
          {
            user,
            email: data.email,
            password: hashedPassword,
          },
          manager,
        );
        return user;
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
