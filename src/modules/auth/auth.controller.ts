import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() newUserData: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.register(newUserData);

    const { access_token, user } = await this.authService.signIn({
      email: newUserData.email,
      password: newUserData.password,
    });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return user;
  }

  @Post('login')
  async login(
    @Body() credentials: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.signIn(credentials);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'lax',
    });

    return user;
  }
}
