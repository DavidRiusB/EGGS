import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RepairDetailsService } from './repair-details.service';
import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';
import { CreateRepairDetailDto } from './dto/repair-details.dto';
import { UpdateRepairDetailDto } from './dto/update-repair-detail.dto';

@Controller('repair-details')
export class RepairDetailsController {
  constructor(private readonly repairDetailsService: RepairDetailsService) {}

  @Get()
  async getAll() {
    return this.repairDetailsService.findAll();
  }

  @Get('by-type')
  async getAllByType(
    @Query('type', new ParseEnumPipe(RepairDetailType))
    type: RepairDetailType,
  ) {
    return this.repairDetailsService.findByType(type);
  }

  @Get('by-name')
  async getDetailByName(@Query('name') name: string) {
    return this.repairDetailsService.findByName(name);
  }

  @Get('/:id')
  async getDetailById(@Param('id', ParseIntPipe) id: number) {
    return this.repairDetailsService.findById(id);
  }

  @Post()
  async createRepairDetail(@Body() data: CreateRepairDetailDto) {
    return this.repairDetailsService.createDetail(data);
  }

  @Patch('/update')
  async updateDetail(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateRepairDetailDto,
  ) {
    return this.repairDetailsService.updateDetail(id, data);
  }

  @Delete(':id')
  async deleteDetail(@Param('id', ParseIntPipe) id: number) {
    await this.repairDetailsService.softDelete(id);
    return { message: 'Repair detail deleted successfully' };
  }
}
