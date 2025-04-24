import { Module } from '@nestjs/common';
import { ReversalsController } from './reversals.controller';
import { ReversalsService } from './reversals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reversal } from './reversa.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { User } from 'src/users/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReversalConsumer } from './consumers/reversal.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reversal, Transaction, User]),
    ClientsModule.register([{
      name: 'REVERSAL_QUEUE',
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'reversao_solicitada',
        queueOptions: { durable: true }
      }
    }])
  ],
  controllers: [ReversalsController, ReversalConsumer],
  providers: [ReversalsService]
})
export class ReversalsModule {}
