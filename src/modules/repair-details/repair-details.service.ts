import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RepairDetailRepository } from './detail.repository';
import { DataSource } from 'typeorm';
import { RepairDetail } from './entity/repair-detail.entity';
import { RepairDetailType } from 'src/common/enums/repair-detail-type.enum';
import { CreateRepairDetailDto } from './dto/repair-details.dto';
import { UpdateRepairDetailDto } from './dto/update-repair-detail.dto';

@Injectable()
export class RepairDetailsService {
  constructor(
    private readonly repairDetailsRepository: RepairDetailRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<RepairDetail[]> {
    return this.repairDetailsRepository.findAll();
  }

  async findByType(type: RepairDetailType): Promise<RepairDetail[]> {
    return this.repairDetailsRepository.findAllByType(type);
  }

  async findByName(name: string): Promise<RepairDetail> {
    const normalizedName = name.trim().toLowerCase();

    const detail =
      await this.repairDetailsRepository.findByName(normalizedName);

    if (!detail) {
      throw new NotFoundException(
        `Repair detail '${normalizedName}' not found`,
      );
    }

    return detail;
  }

  async findById(id: number): Promise<RepairDetail | null> {
    return this.repairDetailsRepository.findById(id);
  }

  async createDetail(data: CreateRepairDetailDto): Promise<RepairDetail> {
    try {
      return await this.repairDetailsRepository.create({
        ...data,
        name: data.name.trim().toLowerCase(),
      });
    } catch (error: any) {
      // unique constraint (Postgres)
      if (error.code === '23505') {
        throw new BadRequestException(
          `Repair detail with name '${data.name}' already exists`,
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error while creating repair detail',
      );
    }
  }

  async updateDetail(
    id: number,
    data: UpdateRepairDetailDto,
  ): Promise<RepairDetail> {
    try {
      const detail = await this.repairDetailsRepository.findById(id);

      if (!detail) {
        throw new NotFoundException(`Repair detail id: ${id} not found`);
      }

      return await this.repairDetailsRepository.patch(detail, {
        ...data,
        ...(data.name && {
          name: data.name.trim().toLowerCase(),
        }),
      });
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `Repair detail with name '${data.name}' already exists`,
        );
      }

      throw new InternalServerErrorException(
        'Unexpected error while updating repair detail',
      );
    }
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.repairDetailsRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Repair detail with id ${id} not found`);
    }
  }
}
