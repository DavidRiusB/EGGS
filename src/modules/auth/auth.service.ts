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
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { TokenType } from 'src/common/enums/token-type.enum';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async register(data: RegisterUserDto) {
    let plainToken: string;
    let createdUser: User;

    try {
      const result = await this.dataSource.transaction(async (manager) => {
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

        const token = await this.tokenService.createToken(
          user,
          TokenType.EMAIL_VERIFICATION,
          60 * 24, // 24h TTL
          manager,
        );

        return { user, token };
      });

      createdUser = result.user;
      plainToken = result.token;
    } catch (error) {
      throw new BadRequestException(error);
    }

    // ---- After commit: send the email (fire-and-forget) ----
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    const verifyUrl = `${frontendUrl}/verify-email?token=${plainToken}`;

    await this.mailService.sendMail({
      to: createdUser.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: createdUser.firstName,
        verifyUrl,
      },
    });

    return createdUser;
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

  async verifyEmail(token: string): Promise<{ verified: true }> {
    return this.dataSource.transaction(async (manager) => {
      const tokenRow = await this.tokenService.validateToken(
        token,
        TokenType.EMAIL_VERIFICATION,
        manager,
      );

      if (!tokenRow) {
        throw new BadRequestException('Invalid or expired verification link');
      }

      const user = tokenRow.user;

      if (user.verified) {
        // Already verified — consume the token and succeed idempotently.
        await this.tokenService.consumeToken(tokenRow, manager);
        return { verified: true };
      }

      user.verified = true;
      await this.userRepository.update(user, manager); // adjust to your repo's save method

      await this.tokenService.consumeToken(tokenRow, manager);

      return { verified: true };
    });
  }

  async resendVerification(user: User): Promise<{ sent: true }> {
    // Nothing to do if already verified.
    if (user.verified) {
      throw new BadRequestException('Your email is already verified');
    }

    let plainToken: string;

    try {
      plainToken = await this.dataSource.transaction(async (manager) => {
        // createToken already invalidates prior active tokens of this type
        return this.tokenService.createToken(
          user,
          TokenType.EMAIL_VERIFICATION,
          60 * 24, // 24h
          manager,
        );
      });
    } catch (error) {
      throw new BadRequestException(error);
    }

    // After commit: send the email (fire-and-forget)
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    const verifyUrl = `${frontendUrl}/verify-email?token=${plainToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      template: 'verify-email',
      context: {
        name: user.firstName,
        verifyUrl,
      },
    });

    return { sent: true };
  }
}
