import { Module } from '@nestjs/common';
import { RepairDetailsService } from './repair-details.service';
import { RepairDetailsController } from './repair-details.controller';

@Module({
  providers: [RepairDetailsService],
  controllers: [RepairDetailsController]
})
export class RepairDetailsModule {}
