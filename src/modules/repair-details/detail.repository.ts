import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepairDetail } from './entity/repair-detail.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';
import { CreateRepairDetailDto } from './dto/repair-details.dto';
import { UpdateRepairDetailDto } from './dto/update-repair-detail.dto';

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

  async findAll(): Promise<RepairDetail[]> {
    return this.repairDetailRepository.find();
  }

  async findAllByType(type: RepairDetailType): Promise<RepairDetail[]> {
    return this.repairDetailRepository.find({ where: { type } });
  }

  async findById(id: number): Promise<RepairDetail | null> {
    return this.repairDetailRepository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<RepairDetail | null> {
    return this.repairDetailRepository.findOne({ where: { name } });
  }

  async findByRepairId(
    repairId: number,
    manager?: EntityManager,
  ): Promise<RepairDetail[]> {
    const repo = this.getRepo(manager);
    return repo.find({
      where: { repair: { id: repairId } },
    });
  }

  async create(data: CreateRepairDetailDto): Promise<RepairDetail> {
    const newDetail = this.repairDetailRepository.create({
      ...data,
      price: data.price.toFixed(2),
      hours: data.hours !== undefined ? data.hours.toFixed(2) : undefined,
    });

    return this.repairDetailRepository.save(newDetail);
  }

  async patch(
    detail: RepairDetail,
    data: UpdateRepairDetailDto,
  ): Promise<RepairDetail> {
    const newDetail = this.repairDetailRepository.merge(detail, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.price !== undefined && {
        price: data.price.toFixed(2),
      }),
      ...(data.hours !== undefined && {
        hours: data.hours.toFixed(2),
      }),
    });

    return this.repairDetailRepository.save(newDetail);
  }

  async softDelete(id: number): Promise<DeleteResult> {
    return this.repairDetailRepository.softDelete(id);
  }
}
