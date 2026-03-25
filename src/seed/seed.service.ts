import { Injectable, Logger } from '@nestjs/common';
import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { ProductType } from 'src/common/enums/product-type.enum';
import { State } from 'src/common/enums/states.enums';
import { hashPassword } from 'src/common/utils/hashing/bycryp.utils';
import { Address } from 'src/modules/address/entity/address.entity';
import { Credential } from 'src/modules/auth/entities/auth.entity';
import { Product } from 'src/modules/products/entity/products.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    this.logger.log('Starting database seeding...');

    await this.dataSource.transaction(async (manager) => {
      const user = await this.seedUsers(manager);
      await this.seedAddresses(manager, user);
      await this.seedProducts(manager);
    });

    this.logger.log('Seeding completed.');
  }

  private async seedUsers(manager: EntityManager): Promise<User> {
    this.logger.log('Seeding users...');

    const userRepository = manager.getRepository(User);
    const credentialRepository = manager.getRepository(Credential);

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      this.logger.log('Users already seeded');

      return await userRepository.findOneOrFail({
        where: { email: 'test@example.com' },
      });
    }

    const user = userRepository.create({
      userName: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      telephone: '123456789',
    });

    const savedUser = await userRepository.save(user);

    const password = '12345678';
    const hashedPassword = await hashPassword(password);

    const credential = credentialRepository.create({
      email: savedUser.email,
      password: hashedPassword,
      user: savedUser,
    });

    await credentialRepository.save(credential);

    this.logger.log('Users seed executed.');

    return savedUser;
  }

  private async seedAddresses(manager: EntityManager, user: User) {
    this.logger.log('Seeding addresses...');

    const addressRepository = manager.getRepository(Address);

    const address = addressRepository.create({
      number: 123,
      cardinalDirection: CardinalDirection.EAST,
      streetName: 'test',
      suffix: AddressSuffix.STREET,
      city: 'test',
      state: State.ALABAMA,
      zipCode: '12345',
      isPrimary: true,
      user,
    });

    await addressRepository.save(address);

    this.logger.log('Address seed executed.');
  }

  private async seedProducts(manager: EntityManager) {
    this.logger.log('Seeding products...');

    const productRepository = manager.getRepository(Product);

    const existing = await productRepository.count();
    if (existing > 0) {
      this.logger.log('Products already seeded');
      return;
    }

    const products = productRepository.create([
      {
        name: 'installation',
        description: 'Basic installation service',
        isTimeBased: true,
        type: ProductType.LABOR,
        price: '50.00',
      },
      {
        name: 'replacement part',
        description: 'Standard replacement part',
        isTimeBased: false,
        type: ProductType.PART,
        price: '30.00',
      },
      {
        name: 'diagnostic',
        description: 'System diagnostic service',
        isTimeBased: true,
        type: ProductType.LABOR,
        price: '20.00',
      },
    ]);

    await productRepository.save(products);

    this.logger.log('Products seed executed.');
  }
}
