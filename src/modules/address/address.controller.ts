import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // usless
  @Get('all')
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

  @Patch('/update/:id')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAddressDto,
  ) {
    return this.addressService.updateAddress(id, data);
  }

  @Delete(':id')
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    await this.addressService.softDelete(id);
    return { message: 'Address deleted successfully' };
  }
}
