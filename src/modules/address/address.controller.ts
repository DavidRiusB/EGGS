import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import * as AddressDocs from '../../swagger/decorators/address.docs';

@AddressDocs.AddressesDocs()
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @AddressDocs.GetUserAddressesDocs()
  @Get('user/:id')
  async getUserAddresses(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    return this.addressService.findUserAddresses(id, user);
  }

  @AddressDocs.RegisterAddressDocs()
  @Post('user/:id')
  async registerAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AddressDto,
    @CurrentUser() user,
  ) {
    return await this.addressService.createAddress(data, id, user);
  }

  @AddressDocs.UpdateAddressDocs()
  @Patch(':id')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAddressDto,
    @CurrentUser() user,
  ) {
    return this.addressService.updateAddress(id, data, user);
  }

  @AddressDocs.DeleteAddressDocs()
  @Delete(':id')
  async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user,
  ) {
    await this.addressService.softDelete(id, user);
    return { message: 'Address deleted successfully' };
  }
}
