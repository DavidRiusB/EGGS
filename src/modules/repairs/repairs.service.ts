import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairRepository } from './repairs.repository';
import { Repair } from './entity/repairs.entity';

@Injectable()
export class RepairsService {
  constructor(private readonly repairRepository: RepairRepository) {}

  async findAll(): Promise<Repair[]> {
    return this.repairRepository.findAll();
  }

  async findAllByUser(userId: number): Promise<Repair[]> {
    return this.repairRepository.findByUser(userId);
  }

  async findById(id: number): Promise<Repair> {
    const repair = await this.repairRepository.findById(id);
    if (!repair) {
      throw new NotFoundException(`Repair ${id} not found`);
    }
    return repair;
  }

  async createRepair(data) {}

  async softDelete(id: number): Promise<void> {
    const result = await this.repairRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Repair ${id} not found`);
    }
  }
}
