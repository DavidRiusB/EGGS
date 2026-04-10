import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { SeedService } from './seed/seed.service';
import { ValidationPipe } from '@nestjs/common';
import SwaggerService from './swagger/swagger.service';

dotenvConfig({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerService.setup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const seedService = app.get(SeedService);
  await seedService.run();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
