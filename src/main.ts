import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

interface ExpressSwaggerCustomOptions {
  explorer?: boolean;
  swaggerOptions?: Record<string, any>;
  customCss?: string;
  customCssUrl?: string;
  customJs?: string;
  customfavIcon?: string;
  swaggerUrl?: string;
  customSiteTitle?: string;
  validatorUrl?: string;
  url?: string;
  urls?: Record<'url' | 'name', string>[];
}

const expressSwaggerCustomOptions: ExpressSwaggerCustomOptions = {
  swaggerOptions: {
    tagsSorter: 'alpha',
  },
  customSiteTitle: 'MeuLar API',
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  const configService = app.get(ConfigService);

  const port = configService.get<string>('SERVER_PORT');
  const config = new DocumentBuilder()
    .setTitle('MeuLar API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only accept DTO fields
    }),
  );
  app.setGlobalPrefix('v1');

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/v1/docs', app, document, expressSwaggerCustomOptions);

  await app.listen(port || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
