import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private jwtService: JwtService
    ) {}

    async create(dto: CreateUserDto): Promise<{ user: User; token: string }> {
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const userAlreadyExists = await this.findByEmail(dto.email)

        if (userAlreadyExists) throw new BadRequestException("Já existe um usuário com esse e-mail")

        const user = this.usersRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword
        })

        const savedUser = await this.usersRepository.save(user)

        const token = this.jwtService.sign({
            sub: savedUser.id,
            email: savedUser.email
        })

        return {
            user: {
                ...savedUser,
                password: ''
            },
            token
        }

    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } })
    }

    async findAll(currentUserId: string): Promise<User[]> {
        return this.usersRepository.find({
            where: {
                id: Not(currentUserId)
            },
            select: ['id', 'email', 'name']
        })
    }

    async findBalance(currentUserId: string): Promise<User[]> {
        return this.usersRepository.find({
            where: {
                id: currentUserId
            },
            select: ['balance']
        })
    }
}
