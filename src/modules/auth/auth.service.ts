import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';
import { RegisterUserDto } from './dto/register.dto';
import {
  hashPassword,
  validateUserPassword,
} from 'src/common/utils/hashing/bycryp.utils';

import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async register(data: RegisterUserDto) {
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

  async signIn(credentials: LoginUserDto) {
    const { email, password } = credentials;

    const credential = await this.authRepository.findByEmail(email);

    if (!credential) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await validateUserPassword(
      password,
      credential.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return credential.user;
  }
}
