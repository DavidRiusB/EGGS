import { Module } from '@nestjs/common';
import { RepairDetailsService } from './repair-details.service';
import { RepairDetailsController } from './repair-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairDetail } from './entity/repair-detail.entity';
import { RepairDetailRepository } from './detail.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RepairDetail]), RepairDetailRepository],
  providers: [RepairDetailsService],
  controllers: [RepairDetailsController],
  exports: [RepairDetailRepository],
})
export class RepairDetailsModule {}
