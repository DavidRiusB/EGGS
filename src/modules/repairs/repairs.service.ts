import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepairRepository } from './repairs.repository';
import { Repair } from './entity/repairs.entity';
import { DataSource } from 'typeorm';
import { UserRepository } from '../user/user.repository';
import { CreateRepairDto } from './dto/create-repair.dto';
import { ProductsRepository } from '../products/products.repository';
import { RepairStatus } from 'src/common/enums/repair-status.enum';

@Injectable()
export class RepairsService {
  constructor(
    private readonly repairRepository: RepairRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductsRepository,
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
    const { userId, items } = data;
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findByIdWithPrimaryAddress(
        userId,
        manager,
      );

      if (!user) {
        throw new NotFoundException(`User with id: ${userId} not found`);
      }

      const primaryAddress = user.addresses[0];
      if (!primaryAddress) {
        throw new BadRequestException('User has no primary address');
      }

      const productsIds = items.map((i) => i.productId);

      const products = await this.productRepository.findProductsByIdInBulk(
        productsIds,
        manager,
      );
      if (products.length !== productsIds.length) {
        throw new BadRequestException('Some products not found');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const details = items.map((item) => {
        const product = productMap.get(item.productId)!;
        const quantity = item.quantity ?? 1;

        const total = (Number(product?.price) * quantity).toFixed(2);

        return {
          name: product.name,
          description: product.description,
          quantity,
          isTimeBased: product.isTimeBased,
          price: product.price,
          total,
        };
      });

      const totalPrice = details
        .reduce((sum, d) => sum + Number(d.total), 0)
        .toFixed(2);

      const repair = manager.create(Repair, {
        user,
        address: primaryAddress,
        status: RepairStatus.COMPLETED,
        price: totalPrice,
        details,
      });
      return await manager.save(repair);
    });
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.repairRepository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Repair ${id} not found`);
    }
  }
}
