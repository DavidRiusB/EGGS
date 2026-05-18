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

  async changeEmail(user: User, newEmail: string): Promise<{ sent: true }> {
    // 1. Verified users cannot change email via this path.
    if (user.verified) {
      throw new BadRequestException(
        'Email cannot be changed after verification',
      );
    }

    // 2. No-op if unchanged (don't re-trigger verification needlessly).
    if (newEmail === user.email) {
      throw new BadRequestException('That is already your email');
    }

    let plainToken: string;

    try {
      plainToken = await this.dataSource.transaction(async (manager) => {
        // Update User.email
        user.email = newEmail;
        await this.userRepository.update(user, manager);

        // Sync Credential.email (login key) — MUST stay in sync
        await this.authRepository.updateEmailByUserId(
          user.id,
          newEmail,
          manager,
        );

        // Issue a fresh verification token (auto-invalidates prior)
        return this.tokenService.createToken(
          user,
          TokenType.EMAIL_VERIFICATION,
          60 * 24,
          manager,
        );
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('That email is already in use');
      }
      throw new BadRequestException(error);
    }

    // After commit: send verification to the NEW address
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    const verifyUrl = `${frontendUrl}/verify-email?token=${plainToken}`;

    await this.mailService.sendMail({
      to: newEmail,
      subject: 'Verify your email',
      template: 'verify-email',
      context: { name: user.firstName, verifyUrl },
    });

    return { sent: true };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Generic response regardless of outcome — no account enumeration.
    const genericResponse = {
      message:
        'If an account exists for that email, a reset link has been sent.',
    };

    const credential = await this.authRepository.findByEmail(email);

    // Email not registered → return success anyway. Do NOT reveal this.
    if (!credential) {
      return genericResponse;
    }

    const user = credential.user;

    let plainToken: string;
    try {
      plainToken = await this.dataSource.transaction(async (manager) => {
        return this.tokenService.createToken(
          user,
          TokenType.PASSWORD_RESET,
          60, // 1 hour TTL — reset links are higher-risk, keep short
          manager,
        );
      });
    } catch (error) {
      // Even on internal failure, don't leak. Log server-side, return generic.
      throw new BadRequestException(error);
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    const resetUrl = `${frontendUrl}/reset-password?token=${plainToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        name: user.firstName,
        resetUrl,
      },
    });

    return genericResponse;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ reset: true }> {
    return this.dataSource.transaction(async (manager) => {
      const tokenRow = await this.tokenService.validateToken(
        token,
        TokenType.PASSWORD_RESET,
        manager,
      );

      if (!tokenRow) {
        throw new BadRequestException('Invalid or expired reset link');
      }

      const user = tokenRow.user;
      const hashed = await hashPassword(newPassword);

      await this.authRepository.updatePasswordByUserId(
        user.id,
        hashed,
        manager,
      );

      await this.tokenService.consumeToken(tokenRow, manager);

      return { reset: true };
    });
  }
}
