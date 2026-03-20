import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async getAllAddresses() {
    return this.addressService.findAll();
  }

  @Get('user/:id')
  async getUserAddresses(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findUserAddresses(id);
  }

  @Post('add/:id')
  async registerAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddressDto,
  ) {
    return await this.addressService.createAddress(data, id);
  }
}
