import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity('transactions')
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;
  
    @Column({ default: false })
    reversed: boolean;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  