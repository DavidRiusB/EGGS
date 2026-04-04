import {
  ForbiddenException,
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
import { Role } from 'src/common/enums/roles.enum';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findUserAddresses(id: number, user): Promise<Address[]> {
    if (user.role !== Role.Admin && user.id !== id) {
      throw new ForbiddenException('You can only access your own addresses');
    }
    return await this.addressRepository.getUserAddresses(id);
  }

  async createAddress(data: AddressDto, id: number, userAuth: User) {
    if (userAuth.role !== Role.Admin && userAuth.id !== id) {
      // admin can create addresses ?
      throw new ForbiddenException('You can only access your own addresses');
    }

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
        const hasPrimary = await this.addressRepository.hasPrimary(id, manager);

        if (!hasPrimary) {
          data.isPrimary = true;
        }
      }

      return await this.addressRepository.create(data, user, manager);
    });
  }

  async updateAddress(id: number, data: UpdateAddressDto, userAuth: User) {
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
      if (userAuth.role !== Role.Admin && userAuth.id !== user.id) {
        throw new ForbiddenException('You can only access your own addresses');
      }

      // enforce primary rules
      if (data.isPrimary === true) {
        await this.addressRepository.clearPrimaryForUser(user.id, manager);
      } else if (data.isPrimary === false) {
        delete data.isPrimary;
      }

      return await this.addressRepository.patch(address, data, manager);
    });
  }

  async softDelete(id: number, user: User): Promise<void> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    if (user.role !== Role.Admin && user.id !== address.user.id) {
      throw new ForbiddenException('Invalid request');
    }

    const result = await this.addressRepository.softDelete(id);

    if (!result.affected) {
      throw new InternalServerErrorException(
        `Failed to delete address with id ${id}`,
      );
    }
  }
}
