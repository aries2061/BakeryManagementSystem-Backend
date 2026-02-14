import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

export function configureApplication(app: INestApplication): void {
  const allowedOrigins = (
    process.env.FRONTEND_ORIGINS || process.env.FRONTEND_URL
  )
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Bakery Management System API')
    .setDescription('The Bakery Management System API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
