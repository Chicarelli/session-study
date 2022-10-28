import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import secureSession from '@fastify/secure-session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(secureSession, {
    secret: 'someverybigjusttotestsomethingaboutsession',
    salt: 'mq9hDxBVDbspDR6n',
  });

  await app.listen(3333);
}
bootstrap();
