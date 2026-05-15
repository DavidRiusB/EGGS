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
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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

  @Get('/availability')
  async getAvailability() {
    return this.appointmentsService.getAvailability();
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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  async updateAppointment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.updateAppointment(id, data);
  }
  @Patch(':id/cancel')
  async cancelAppointment(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.appointmentsService.cancelAppointment(id, user);
  }
}
