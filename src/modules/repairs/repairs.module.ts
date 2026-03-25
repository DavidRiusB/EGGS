import { Module } from '@nestjs/common';
import { RepairsController } from './repairs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRepository } from './repairs.repository';
import { RepairsService } from './repairs.service';
import { Repair } from './entity/repairs.entity';
import { ProductsModule } from '../products/products.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Repair]), ProductsModule, UserModule],
  controllers: [RepairsController],
  providers: [RepairsService, RepairRepository],
})
export class RepairsModule {}
