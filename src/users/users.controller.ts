import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@Req() req) {
        return this.usersService.findAll(req.user.userId)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('balance')
    async findBalance(@Req() req) {
        return this.usersService.findBalance(req.user.userId)
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
        return this.usersService.create(createUserDto);
    }
}
