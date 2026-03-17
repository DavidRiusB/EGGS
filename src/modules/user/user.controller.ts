import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './user-update.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Fetch all
  @Get()
  async getAllUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.userService.findAll({ page, limit });
  }

  // 🔍 Search by Id
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  // 🔍 Search by email
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  // 🔍 Search by telephone
  @Get('phone/:telephone')
  async getUserByTelephone(@Param('telephone') telephone: string) {
    return this.userService.findByTelephone(telephone);
  }

  // Update User
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UserUpdateDto,
  ) {
    return this.userService.update(id, userData);
  }
}
