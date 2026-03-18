import { Injectable, Logger } from '@nestjs/common';
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

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      this.logger.log('Users already seeded');
      return;
    }

    const user = userRepository.create({
      userName: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      telephone: '123456789',
    });

    await userRepository.save(user);

    // test query
    await manager.query(`SELECT 1`);

    this.logger.log('Users seed executed.');
  }
}
