import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { Address } from './entity/address.entity';
import { AddressDto } from './dto/address.dto';
import { UserRepository } from '../user/user.repository';
import { DataSource } from 'typeorm';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Address[]> {
    return this.addressRepository.findAllAddresses();
  }
  async findUserAddresses(id: number): Promise<Address[] | Error> {
    return await this.addressRepository.getUserAddresses(id);
  }

  async createAddress(data: AddressDto, id: number) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // find user
        const user = await this.userRepository.findById(id, manager);

        if (!user) {
          throw new NotFoundException(`User with id ${id} not found`);
        }

        // enforce primary rules
        if (data.isPrimary) {
          await this.addressRepository.clearPrimaryForUser(id, manager);
        } else {
          const hasPrimary = await this.addressRepository.hasPrimary(
            id,
            manager,
          );

          if (!hasPrimary) {
            data.isPrimary = true;
          }
        }

        return await this.addressRepository.create(data, user, manager);
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unexpected error while creating address',
      );
    }
  }

  async updateAddress(id: number, data: UpdateAddressDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const address = await this.addressRepository.findById(id, manager);

        if (!address) {
          throw new NotFoundException(`Address with id ${id} not found`);
        }

        const user = address.user;

        if (!user) {
          throw new InternalServerErrorException(
            'Address is missing associated user',
          );
        }

        // enforce primary rules
        if (data.isPrimary === true) {
          await this.addressRepository.clearPrimaryForUser(user.id, manager);
        } else if (data.isPrimary === false) {
          delete data.isPrimary;
        }

        return await this.addressRepository.patch(address, data, manager);
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'Unexpected error while updating address',
      );
    }
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.addressRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
  }
}
