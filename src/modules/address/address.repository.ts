import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findAllAddresses(): Promise<Address[]> {
    return this.addressRepository.find();
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
    const repo = manager
      ? manager.getRepository(Address)
      : this.addressRepository;
    await repo.update({ user: { id }, isPrimary: true }, { isPrimary: false });
  }

  async create(
    data: AddressDto,
    user: User,
    manager?: EntityManager,
  ): Promise<Address> {
    const repo = manager
      ? manager.getRepository(Address)
      : this.addressRepository;
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
    const repo = manager
      ? manager.getRepository(Address)
      : this.addressRepository;

    const count = await repo.count({
      where: { user: { id: userId }, isPrimary: true },
    });
    return count > 0;
  }
}
