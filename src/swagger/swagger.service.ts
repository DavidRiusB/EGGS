import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

class SwaggerService {
  static setup(app: INestApplication): void {
    if (process.env.ENABLE_SWAGGER !== 'true') {
      return;
    }

    const config = new DocumentBuilder()
      .setTitle('EglaisysTech API')
      .setDescription('Backend API')
      .setVersion('0.1')
      .addBearerAuth() // optional, but recommended
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);
  }
}

export default SwaggerService;
