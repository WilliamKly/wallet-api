import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/transaction.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Reversal } from './reversa.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReversalsService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Reversal)
        private reversalRepository: Repository<Reversal>,

        @Inject('REVERSAL_QUEUE')
        private readonly reversalQueue: ClientProxy
    ) {}

    async solicitReversal(transactionId: string, requesterId: string) {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['sender', 'receiver']
        })

        if (!transaction) throw new NotFoundException("Transação não encontrada")
        if (transaction.receiver.id !== requesterId) throw new BadRequestException("Você não pode reverter essa transação")
        if (transaction.reversed) throw new BadRequestException("Transação já foi revertida")

        const user = await this.userRepository.findOneBy({ id: requesterId })

        if (!user) throw new NotFoundException('Usuário solicitante não encontrado');

        const reversal = this.reversalRepository.create({
            transaction,
            requestedBy: user,
            status: 'pending',
        })

        const saved = await this.reversalRepository.save(reversal)

        await this.reversalQueue.emit('reversao_solicitada', {
            reversalId: reversal.id
        })

        return { message: "Solicitação registrada", reversalId: saved.id }
    }
}
