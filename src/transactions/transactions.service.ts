import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { DepositDto } from './dto/deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        
        private dataSource: DataSource
    ) {}

    async deposit(userId: string, dto: DepositDto) {
        if (dto.amount <= 0) throw new BadRequestException('O valor do depósito precisa ser maior que zero')

        const user = await this.userRepository.findOne({ where: { id: userId } })

        if (!user) throw new NotFoundException('Usuário não encontrado')

        user.balance = +user.balance + +dto.amount;

        await this.userRepository.save(user)

        return { message: 'Depósito realizado com sucesso', newBalance: user.balance }
    }

    async transfer(senderId: string, dto: TransferDto) {
        if (dto.amount <= 0) throw new BadRequestException("O valor precisa ser maior que zero")
        if (senderId === dto.receiverId) throw new BadRequestException("Você não pode transferir para si mesmo")

        return this.dataSource.transaction(async manager => {
            const sender = await manager.findOne(User, { where: { id: senderId } })
            const receiver = await manager.findOne(User, { where: { id: dto.receiverId } })

            if (!sender || !receiver) throw new NotFoundException("Usuário não encontrado")

            if (+sender.balance < +dto.amount) throw new BadRequestException("Saldo insuficiente")

            sender.balance = +sender.balance - +dto.amount
            receiver.balance = +receiver.balance + +dto.amount

            await manager.save(sender)
            await manager.save(receiver)

            const transaction = manager.create(Transaction, {
                sender,
                receiver,
                amount: dto.amount,
                reversed: false
            })

            await manager.save(transaction)

            return {
                message: "Transferência realizada com sucesso!",
                transactionId: transaction.id
            }
        })
        
    }

    async findAll(currentUserId: string): Promise<(Transaction & { receiverUser: boolean })[]> {
        const transactions = await this.transactionRepository.find({
          where: [
            { sender: { id: currentUserId } },
            { receiver: { id: currentUserId } }
          ],
          relations: ['sender', 'receiver'],
          order: {
            createdAt: 'DESC'
          }
        });
      
        return transactions.map(tx => ({
          ...tx,
          receiverUser: tx.receiver.id === currentUserId,
        }));
      }
      
}
