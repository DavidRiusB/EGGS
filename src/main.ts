import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { SeedService } from './seed/seed.service';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seedService = app.get(SeedService);
  await seedService.run();

  const configService = app.get(ConfigService);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
