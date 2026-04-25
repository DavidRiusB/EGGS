import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getAllUsers(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('phone/:telephone')
  async getUserByTelephone(@Param('telephone') telephone: string) {
    return this.userService.findByTelephone(telephone);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.userService.findUserById(id, user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UserUpdateDto,
    @CurrentUser() user,
  ) {
    return this.userService.update(id, userData, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(id, data.role);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    await this.userService.softDelete(id, user);
    return { message: 'User deleted successfully' };
  }
}
