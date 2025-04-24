import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { DataSource } from "typeorm";
import { Reversal } from "../reversa.entity";


@Controller()
export class ReversalConsumer {
    constructor(private readonly dataSource: DataSource) {}

    @EventPattern('reversao_solicitada')
    async handleRevert(@Payload() data: { reversalId: string }, @Ctx() context: RmqContext) {
        const manager = this.dataSource.createQueryRunner().manager

        const reversal = await manager.findOne(Reversal, {
            where: { id: data.reversalId },
            relations: ['transaction', 'transaction.sender', 'transaction.receiver']
        })

        if (!reversal) return

        try {
            const { transaction } = reversal
            const sender = transaction.sender
            const receiver = transaction.receiver

            if (+receiver.balance < +transaction.amount) throw new Error('Saldo insuficiente')

            sender.balance = +sender.balance + +transaction.amount
            receiver.balance = +receiver.balance - +transaction.amount

            transaction.reversed = true
            
            reversal.status = 'completed'
            reversal.processedAt = new Date()

            await manager.save([sender, receiver, transaction, reversal])
        } catch (error) {
            reversal.status = 'failed'
            reversal.errorMessage = error.message
            await manager.save(reversal)
        }
        
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        channel.ack(originalMessage)
    }
}
