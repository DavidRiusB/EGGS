import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAppointments(
    @Query() query: FindAppointmentsDto,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.findAppointments(query, user);
  }

  @Get(':id')
  async findAppointmentById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.findById(id, user);
  }

  @Post()
  async createAppointment(
    @Body() data: CreateAppointmentDto,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.createAppointment(data, user);
  }

  @Patch(':id')
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.updateAppointment(id, data, user);

    // missing
  }

  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.cancelAppointment(id, user);
  }
}
