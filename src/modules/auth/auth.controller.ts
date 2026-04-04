import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() newUserData: RegisterUserDto) {
    return this.authService.register(newUserData);
  }

  @Post('login')
  async login(@Body() Credentials: LoginUserDto) {
    return this.authService.signIn(Credentials);
  }

  // reset passwords
}
