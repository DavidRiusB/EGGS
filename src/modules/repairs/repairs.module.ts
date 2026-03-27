import { Module } from '@nestjs/common';
import { RepairsController } from './repairs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRepository } from './repairs.repository';
import { RepairsService } from './repairs.service';
import { Repair } from './entity/repairs.entity';
import { ProductsModule } from '../products/products.module';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repair]),
    ProductsModule,
    UserModule,
    AddressModule,
  ],
  controllers: [RepairsController],
  providers: [RepairsService, RepairRepository],
})
export class RepairsModule {}
