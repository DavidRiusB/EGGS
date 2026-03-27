import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';

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
// bugs entity requierments not fullfilled 
  @Post()
  async createRepair(@Body() data: CreateRepairDto) {
    return this.repairService.createRepair(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.repairService.softDelete(id);
    return { message: 'Repair deleted successfully' };
  }
}
