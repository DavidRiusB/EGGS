import { Injectable, NotFoundException } from '@nestjs/common';
import { RepairRepository } from './repairs.repository';
import { DataSource } from 'typeorm';
import { Repair } from './entity/repairs.entity';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class RepairsService {
  constructor(
    private readonly repairRepository: RepairRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

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

  async createRepair(data: CreateRepairDto) {
    const { userId, details } = data;
    try {
      return await this.dataSource.transaction(async (manager) => {
        // find user
        const user = await this.userRepository.findByIdWithPrimaryAddress(
          userId,
          manager,
        );
        if (!user) {
          throw new NotFoundException(`User with Id ${userId} not found`);
        }

        // find details
      });
    } catch (error) {}
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.repairRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Repair ${id} not found`);
    }
  }
}
