import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const hashedPassword = await hashPassword(data.password);

        const user = await this.userRepository.create(data, manager);

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

    // 🔥 NEW: generate JWT
    const payload = {
      sub: credential.user.id,
      email: credential.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: credential.user,
    };
  }
}
