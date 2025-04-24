import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
    
        if (!user) throw new UnauthorizedException("Credenciais inválidas");
    
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new UnauthorizedException("Credenciais inválidas");
    
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    // @TODO retirar esse any daqui
    async login(user: any) {
        const payload = { sub: user.id, email: user.email }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
