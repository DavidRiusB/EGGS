import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';

@Module({
  providers: [AddressService, AddressRepository],
  controllers: [AddressController],
})
export class AddressModule {}
