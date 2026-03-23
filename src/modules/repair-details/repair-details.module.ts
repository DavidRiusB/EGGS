import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairDetail } from './entity/repair-detail.entity';
import { RepairDetailRepository } from './repair-details.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RepairDetail]), RepairDetailRepository],
  exports: [RepairDetailRepository],
})
export class RepairDetailsModule {}
