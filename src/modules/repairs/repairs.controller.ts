import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { UpdateRepairDetailsDto } from './dto/update-repair-details.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/roles.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as RepairDocs from '../../swagger/decorators/repairs.docs';

@RepairDocs.RepairsDocs()
@Controller('repairs')
@UseGuards(JwtAuthGuard)
export class RepairsController {
  constructor(private readonly repairService: RepairsService) {}

  @RepairDocs.GetAllRepairsDocs()
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getAllRepairs(@Query() pagination: PaginationDto) {
    return this.repairService.findAll(pagination);
  }

  @RepairDocs.GetRepairsByUserIdDocs()
  @Get('user/:userId')
  async getRepairsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationDto,
    @CurrentUser() user,
  ) {
    return this.repairService.findAllByUser(userId, pagination, user);
  }

  @RepairDocs.GetRepairByIdDocs()
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user) {
    return this.repairService.findById(id, user);
  }

  @RepairDocs.CreateRepairDocs()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createRepair(@Body() data: CreateRepairDto) {
    return this.repairService.createRepair(data);
  }

  @RepairDocs.UpdateRepairDocs()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async updateRepair(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRepairDto,
  ) {
    return this.repairService.updateRepair(id, data);
  }

  @RepairDocs.UpdateRepairDetailsDocs()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/details')
  async updateRepairDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRepairDetailsDto,
  ) {
    return this.repairService.updateRepairDetails(id, data);
  }

  @RepairDocs.DeleteRepairDocs()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteRepair(@Param('id', ParseIntPipe) id: number) {
    await this.repairService.deleteRepair(id);
    return { message: 'Repair deleted successfully' };
  }
}
