import { Injectable } from '@nestjs/common';
import { TwitchRepository } from './twitch.repository';

@Injectable()
export class TwitchService {

    constructor(private twitchRepository: TwitchRepository) { }

    async getAccessToken(codeToken: string) {
        return this.twitchRepository.getOauthTokens(codeToken);
    }

    async getUser({ access_token }) {
        return this.twitchRepository.getUser({ access_token });
    }
}
