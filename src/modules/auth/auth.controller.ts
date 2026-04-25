import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // dev mode
      path: '/',
    });

    return { success: true };
  }
}
