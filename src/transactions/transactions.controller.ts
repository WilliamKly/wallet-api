import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Req() req) {
        return this.transactionsService.findAll(req.user.userId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deposit')
    async deposit(@Req() req, @Body() dto: DepositDto) {
        const user = req.user
        return this.transactionsService.deposit(user.userId, dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('transfer')
    async transfer(@Req() req, @Body() dto: TransferDto) {
        const user = req.user
        return this.transactionsService.transfer(user.userId, dto)
    }
}
