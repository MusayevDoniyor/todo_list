import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Todo List')
    .setDescription('Todo List Api')
    .build();
  const factory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, factory);

  const PORT = process.env.PORT ?? 3000;
  await app
    .listen(PORT)
    .then(() =>
      console.log(`🚀 Server is running on http://localhost:${PORT}/api`),
    )
    .catch((err) => console.error(`❌ ${err.message}`));
}
bootstrap();
