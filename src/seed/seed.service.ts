import { Injectable, Logger } from '@nestjs/common';
import { hashPassword } from 'src/common/utils/hashing/bycryp.utils';
import { Credential } from 'src/modules/auth/entities/auth.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    this.logger.log('Starting database seeding...');

    await this.dataSource.transaction(async (manager) => {
      await this.seedUsers(manager);
    });
    this.logger.log('Seeding completed.');
  }

  private async seedUsers(manager: any) {
    this.logger.log('Seeding users...');
    const userRepository = manager.getRepository(User);
    const credentialRepository = manager.getRepository(Credential);

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      this.logger.log('Users already seeded');
      return;
    }

    // 👉 Create user
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

    // 👉 Create credential linked to user
    const credential = credentialRepository.create({
      email: savedUser.email,
      password: hashedPassword,
      user: savedUser,
    });
    await credentialRepository.save(credential);

    this.logger.log('Users seed executed.');
  }
}
