import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReversalsService } from './reversals.service';

@Controller('reversals')
export class ReversalsController {
    constructor(private readonly reversalsService: ReversalsService) {}
    
    @UseGuards(AuthGuard('jwt'))
    @Post(':id')
    async solicitRevert(@Param('id') id: string, @Req() req) {
        const user = req.user
        return this.reversalsService.solicitReversal(id, user.userId)
    }
}
