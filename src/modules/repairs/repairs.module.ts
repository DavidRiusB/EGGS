import { Module } from '@nestjs/common';
import { RepairsController } from './repairs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRepository } from './repairs.repository';
import { RepairsService } from './repairs.service';
import { Repair } from './entity/repairs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repair])],
  controllers: [RepairsController],
  providers: [RepairsService, RepairRepository],
})
export class RepairsModule {}
