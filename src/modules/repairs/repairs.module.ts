import { Module } from '@nestjs/common';
import { RepairsController } from './repairs.controller';
import { RepairsService } from './repairs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRepository } from './repairs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RepairRepository]), RepairRepository],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [],
})
export class RepairsModule {}
