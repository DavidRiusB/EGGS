import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

class SwaggerService {
  static setup(app: INestApplication): void {
    if (process.env.ENABLE_SWAGGER !== 'true') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const config = new DocumentBuilder()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .setTitle('My API')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .setDescription('Private API documentation')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .setVersion('1.0')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .addBearerAuth() // optional, but recommended
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .build();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const document = SwaggerModule.createDocument(app, config);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    SwaggerModule.setup('api', app, document);
  }
}

export default SwaggerService;
