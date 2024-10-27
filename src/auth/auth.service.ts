import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwitchService } from 'src/twitch/twitch.service';

@Injectable()
export class AuthService {

    constructor(private twitchService: TwitchService, private jwtService: JwtService) { }

    async login(code) {

        const { access_token } = await this.twitchService.getAccessToken(code);

        const user = await this.twitchService.getUser({ access_token })

        return {
            user,
            access_token: this.jwtService.sign({ ...user, code })
        }
    }

}
