import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
  providers: [AddressService, AddressRepository],
  controllers: [AddressController],
  exports: [AddressRepository],
})
export class AddressModule {}
