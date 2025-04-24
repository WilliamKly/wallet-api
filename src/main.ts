import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'reversao_solicitada',
      queueOptions: {
        durable: true
      },
      noAck: false
    }
  })

  app.enableCors()

  await app.startAllMicroservices()
  await app.listen(process.env.PORT ?? 3001)
  console.log("Running...")
}
bootstrap();
