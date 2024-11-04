import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private configService: ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {


        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const access_token = request.headers["x-twitch-token"];

        if (!token || !access_token) {
            throw new UnauthorizedException();
        }
        try {
            const decoded = await this.authService.validateIdToken(token)

            const isTestUser = decoded.payload.sub === this.configService.get("TWITCH_DEV_USER");

            request['user'] = { ...decoded.payload, access_token, isTestUser };

            if (this.configService.get("ENABLE_TWITCH_MOCK")) {
                request['user'].sub = this.configService.get("TWITCH_USER_MOCK");
                request["user"].access_token = this.configService.get("TWITCH_TOKEN_MOCK");
            }

        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const id_token = request.headers.authorization
        return id_token;
    }
}

