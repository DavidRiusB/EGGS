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

  async findAll(): Promise<Repair[]> {
    return this.repairRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<Repair[]> {
    return this.repairRepository.find({
      where: { user: { id: userId } },
      relations: ['details', 'address'],
    });
  }

  async findById(id: number): Promise<Repair | null> {
    return this.repairRepository.findOne({
      where: { id },
      relations: ['details', 'user', 'address'],
    });
  }

  // create

  // patch

  async softDelete(id: number): Promise<DeleteResult> {
    return this.repairRepository.softDelete({ id });
  }
}
