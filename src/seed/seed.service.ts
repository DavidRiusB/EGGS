import { Injectable, Logger } from '@nestjs/common';
import { AddressSuffix } from 'src/common/enums/address-suffixes.enum';
import { CardinalDirection } from 'src/common/enums/cardinal-directions.enum';
import { ProductType } from 'src/common/enums/product-type.enum';
import { Role } from 'src/common/enums/roles.enum';
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
      const { user, admin } = await this.seedUsers(manager);
      await this.seedAddresses(manager, user);
      await this.seedProducts(manager);
    });

    this.logger.log('Seeding completed.');
  }

  private async seedUsers(
    manager: EntityManager,
  ): Promise<{ user: User; admin: User }> {
    this.logger.log('Seeding users...');

    const userRepository = manager.getRepository(User);

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      this.logger.log('Users already seeded');

      const user = await userRepository.findOneOrFail({
        where: { email: 'test@example.com' },
      });
      const admin = await userRepository.findOneOrFail({
        where: { email: 'admin@example.com' },
      });
      return { user, admin };
    }

    // Regular user (used for address seed + as the main test customer)
    const user = await this.createUserWithCredentials(
      manager,
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        telephone: '123456789',
        role: Role.User,
      },
      '12345678',
    );

    // Admin user
    const admin = await this.createUserWithCredentials(
      manager,
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        telephone: '987654321',
        role: Role.Admin,
      },
      'admin12345',
    );

    // Extra users for testing search
    const extras = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        telephone: '5551234567',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        telephone: '5559876543',
      },
      {
        firstName: 'Bob',
        lastName: 'Jones',
        email: 'bob.jones@example.com',
        telephone: '5551112222',
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.j@example.com',
        telephone: '5553334444',
      },
    ];

    for (const data of extras) {
      await this.createUserWithCredentials(
        manager,
        { ...data, role: Role.User },
        'password123',
      );
    }

    this.logger.log('Users seed executed.');

    return { user, admin };
  }

  private async createUserWithCredentials(
    manager: EntityManager,
    userData: Partial<User>,
    plainPassword: string,
  ): Promise<User> {
    const userRepository = manager.getRepository(User);
    const credentialRepository = manager.getRepository(Credential);

    const user = userRepository.create(userData);
    const savedUser = await userRepository.save(user);

    const credential = credentialRepository.create({
      email: savedUser.email,
      password: await hashPassword(plainPassword),
      user: savedUser,
    });
    await credentialRepository.save(credential);

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
