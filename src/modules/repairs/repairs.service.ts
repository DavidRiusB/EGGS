import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepairRepository } from './repairs.repository';
import { Repair } from './entity/repairs.entity';
import { DataSource, getManager } from 'typeorm';
import { UserRepository } from '../user/user.repository';
import { CreateRepairDto } from './dto/create-repair.dto';
import { ProductsRepository } from '../products/products.repository';
import { RepairStatus } from 'src/common/enums/repair-status.enum';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { AddressRepository } from '../address/address.repository';
import { UpdateRepairDetailsDto } from './dto/update-repair-details.dto';
import { RepairDetail } from '../repair-details/entity/repair-detail.entity';

@Injectable()
export class RepairsService {
  constructor(
    private readonly repairRepository: RepairRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductsRepository,
    private readonly addressRepository: AddressRepository,
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

  async createRepair(data: CreateRepairDto): Promise<Repair> {
    const { userId, items, paymentMethod } = data;
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

        const total = (Number(product.price) * quantity).toFixed(2);

        return {
          name: product.name,
          type: product.type,
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
        paymentMethod,
        details,
      });
      return await manager.save(repair);
    });
  }

  async updateRepair(id: number, data: UpdateRepairDto): Promise<Repair> {
    return this.dataSource.transaction(async (manager) => {
      const repair = await this.repairRepository.findById(id, manager);

      if (!repair) {
        throw new NotFoundException(`Repair with id: ${id} not found`);
      }

      // 🔹 Address update
      if (data.addressId !== undefined) {
        const newAddress = await this.addressRepository.findById(
          data.addressId,
          manager,
        );

        if (!newAddress) {
          throw new NotFoundException(
            `Address with id: ${data.addressId} not found`,
          );
        }

        if (newAddress.user.id !== repair.user.id) {
          throw new BadRequestException(
            'Address does not belong to the same user as the repair',
          );
        }

        repair.address = newAddress;
      }

      if (data.status !== undefined) {
        repair.status = data.status;
      }

      if (data.paymentMethod !== undefined) {
        repair.paymentMethod = data.paymentMethod;
      }

      return await manager.save(Repair, repair);
    });
  }

  async updateRepairDetails(
    repairId: number,
    detailsData: UpdateRepairDetailsDto,
  ): Promise<Repair> {
    const { items } = detailsData;

    return this.dataSource.transaction(async (manager) => {
      const repair = await this.repairRepository.findById(repairId, manager);

      if (!repair) {
        throw new NotFoundException(`Repair with id: ${repairId} not found`);
      }

      if (!items.length) {
        throw new BadRequestException('Repair must have at least one item');
      }

      const productIds = items.map((i) => i.productId);

      const products = await this.productRepository.findProductsByIdInBulk(
        productIds,
        manager,
      );

      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products not found');
      }

      const productMap = new Map(products.map((p) => [p.id, p]));

      const details = items.map((item) => {
        const product = productMap.get(item.productId)!;
        const quantity = item.quantity ?? 1;

        const total = (Number(product.price) * quantity).toFixed(2);

        return manager.create(RepairDetail, {
          name: product.name,
          type: product.type,
          description: product.description,
          quantity,
          isTimeBased: product.isTimeBased,
          price: product.price,
          total,
          repair,
        });
      });

      const totalPrice = details
        .reduce((sum, d) => sum + Number(d.total), 0)
        .toFixed(2);

      // 🔥 Remove old details
      await manager.delete(RepairDetail, { repair: { id: repairId } });

      // 🔹 Assign new ones
      repair.details = details;
      repair.price = totalPrice;

      return await manager.save(Repair, repair);
    });
  }

  async deleteRepair(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const repair = await this.repairRepository.findById(id, manager);

      if (!repair) {
        throw new NotFoundException(`Repair with id: ${id} not found`);
      }

      if (repair.status === RepairStatus.COMPLETED) {
        throw new BadRequestException('Cannot delete a completed repair');
      }

      if (repair.deletedAt) {
        throw new BadRequestException('Repair is already deleted');
      }

      const result = await this.repairRepository.softDelete(id, manager);

      if (!result.affected) {
        throw new NotFoundException(`Failed to delete repair with id ${id}`);
      }
    });
  }
}
