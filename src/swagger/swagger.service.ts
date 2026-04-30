import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

class SwaggerService {
  static setup(app: INestApplication): void {
    if (process.env.ENABLE_SWAGGER !== 'true') {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('Private API documentation')
      .setVersion('1.0')
      .addBearerAuth() // optional, but recommended
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
  }
}

export default SwaggerService;
