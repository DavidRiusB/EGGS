import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAppointments(@Query() query: FindAppointmentsDto) {
    return this.appointmentsService.findAppointments(query);
  }

  @Get(':id')
  async findAppointmentById(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findById(id);
  }

  @Post()
  async createAppointment(@Body() data: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(data);
  }

  @Patch(':id')
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.appointmentsService.updateAppointment(id, data);
  }

  @Patch(':id/cancel')
  async cancelAppointment(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.cancelAppointment(id);
  }
}
