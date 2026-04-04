import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { Repair } from './entity/repairs.entity';

@Injectable()
export class RepairRepository {
  constructor(
    @InjectRepository(Repair)
    private readonly repairRepository: Repository<Repair>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<Repair> {
    return manager ? manager.getRepository(Repair) : this.repairRepository;
  }

  async findAll(pagination: {
    page: number;
    limit: number;
  }): Promise<{ data: Repair[]; total: number }> {
    const { page, limit } = pagination;

    const offset = (page - 1) * limit;

    const [data, total] = await this.repairRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { date: 'DESC' },
    });

    return { data, total };
  }

  async findByUser(
    userId: number,
    pagination: { page: number; limit: number },
  ): Promise<{ data: Repair[]; total: number }> {
    const { page, limit } = pagination;

    const offset = (page - 1) * limit;

    const [data, total] = await this.repairRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['details', 'address'],
      skip: offset,
      take: limit,
      order: { date: 'DESC' },
    });

    return { data, total };
  }

  async findById(id: number, manager?: EntityManager): Promise<Repair | null> {
    const repo = this.getRepo(manager);
    return repo.findOne({
      where: { id },
      relations: ['details', 'user', 'address'],
    });
  }

  // patch

  async softDelete(id: number, manager?: EntityManager): Promise<DeleteResult> {
    const repo = this.getRepo(manager);
    return repo.softDelete({ id });
  }
}
