import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { RepairDetail } from './entity/repair-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepairDetailRepository {
  constructor(
    @InjectRepository(RepairDetail)
    private readonly repairDetailRepository: Repository<RepairDetail>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<RepairDetail> {
    return manager
      ? manager.getRepository(RepairDetail)
      : this.repairDetailRepository;
  }

  async createDetails(data, manager?: EntityManager) {
    const repo = await this.getRepo(manager);
  }
}
