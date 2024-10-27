import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "custom") {
    constructor(private authService: AuthService) {
        super();
    }
    async validate(req) {
        // try {
        //     const code = req.body.code
        //     if (code) {
        //         throw new UnauthorizedException();
        //     }
        //     const user = await this.authService.validateUser(code);
        //     return user;

        // } catch (e) {
        //     Logger.error(e, "LocalStrategy")
        //     throw new UnauthorizedException();
        // }

    }
}