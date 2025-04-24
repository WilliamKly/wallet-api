import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Transaction } from 'src/transactions/transaction.entity';
  import { User } from 'src/users/user.entity'; 
  
  @Entity('reversals')
  export class Reversal {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Transaction)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'requested_by' })
    requestedBy: User;
  
    @Column({ default: 'pending' })
    status: string;
  
    @Column({ nullable: true })
    errorMessage: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    processedAt: Date;
  }
  