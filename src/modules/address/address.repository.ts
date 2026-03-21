import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  private getRepo(manager?: EntityManager): Repository<Address> {
    return manager ? manager.getRepository(Address) : this.addressRepository;
  }

  async findAllAddresses(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  async findById(id: number, manager?: EntityManager): Promise<Address | null> {
    const repo = this.getRepo(manager);
    return repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getUserAddresses(id: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { user: { id } },
    });
  }

  async clearPrimaryForUser(
    id: number,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = this.getRepo(manager);
    await repo.update({ user: { id }, isPrimary: true }, { isPrimary: false });
  }

  async create(
    data: AddressDto,
    user: User,
    manager?: EntityManager,
  ): Promise<Address> {
    const repo = this.getRepo(manager);
    const {
      number,
      cardinalDirection,
      streetName,
      suffix,
      city,
      state,
      zipCode,
      notes,
      isPrimary,
    } = data;
    const newAddress = repo.create({
      number,
      cardinalDirection,
      streetName,
      suffix,
      city,
      state,
      zipCode,
      notes,
      isPrimary: isPrimary ?? false,
      user,
    });
    return repo.save(newAddress);
  }

  async hasPrimary(userId: number, manager?: EntityManager): Promise<boolean> {
    const repo = this.getRepo(manager);

    const count = await repo.count({
      where: { user: { id: userId }, isPrimary: true },
    });
    return count > 0;
  }

  async softDelete(id: number): Promise<DeleteResult> {
    return this.addressRepository.softDelete(id);
  }

  async patch(
    address: Address,
    data: Partial<Address>,
    manager?: EntityManager,
  ) {
    const repo = this.getRepo(manager);

    const updateAddress = repo.merge(address, data);

    return repo.save(updateAddress);
  }
}
