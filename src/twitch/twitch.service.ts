import { Injectable } from '@nestjs/common';
import { TwitchRepository } from './twitch.repository';
import { User } from 'src/auth/types/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwitchService {

    constructor(private twitchRepository: TwitchRepository, private configService: ConfigService) { }

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

    async subscribeEndPollEvent({ user }) {
        const data = {
            type: "channel.poll.end",
            version: "1",
            condition: {
                "broadcaster_user_id": user.sub
            },
            transport: {
                "method": "webhook",
                "callback": this.configService.getOrThrow("TWITCH_CALLBACK_URL"),
                "secret": this.configService.getOrThrow("TWITCH_WEBHOOK_SECRET"),
            }
        }
        const res = await this.twitchRepository.subscribeEvent({ data, acces_token: user.access_token });
        return res.data
    }
}
