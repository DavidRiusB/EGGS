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
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { ProductRefDto } from '../products/dto/product-ref.dto';
import { UpdateRepairDetailsDto } from './dto/update-repair-details.dto';

@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairService: RepairsService) {}

  @Get()
  async getAll() {
    return this.repairService.findAll();
  }

  @Get('user/:userId')
  async getRepairsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.repairService.findAllByUser(userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.repairService.findById(id);
  }

  @Post()
  async createRepair(@Body() data: CreateRepairDto) {
    return this.repairService.createRepair(data);
  }

  @Patch(':id')
  async updateRepair(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRepairDto,
  ) {
    return this.repairService.updateRepair(id, data);
  }

  @Patch(':id/details')
  async updateRepairDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRepairDetailsDto,
  ) {
    return this.repairService.updateRepairDetails(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.repairService.deleteRepair(id);
    return { message: 'Repair deleted successfully' };
  }
}
