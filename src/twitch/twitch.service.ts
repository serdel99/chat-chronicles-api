import { Injectable } from '@nestjs/common';
import { TwitchRepository } from './twitch.repository';
import { User } from 'src/auth/types/user';

@Injectable()
export class TwitchService {

    constructor(private twitchRepository: TwitchRepository) { }

    async getAccessToken(codeToken: string) {
        return this.twitchRepository.getOauthTokens(codeToken);
    }

    async getUser({ access_token }) {
        return this.twitchRepository.getUser({ access_token });
    }

    async initPoll({ user, options, question }: { user: User, options: string[], question: string }) {
        const pollOptions = {
            broadcaster_id: user.sub,
            title: question,
            choices: options.map((option) => ({ title: option })),
            duration: 120
        }
        const response = await this.twitchRepository.initPoll(user.access_token, pollOptions)
        return response.data[0];
    }
}
