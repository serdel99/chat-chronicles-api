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

    createMockedPoll(poll: any) {
        return {
            "subscription": {
                "id": "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
                "type": "channel.poll.end",
                "version": "1",
                "status": "enabled",
                "cost": 0,
                "condition": {
                    "broadcaster_user_id": "1337"
                },
                "transport": {
                    "method": "webhook",
                    "callback": "https://example.com/webhooks/callback"
                },
                "created_at": "2019-11-16T10:11:12.634234626Z"
            },
            "event": {
                "id": poll.id,
                "broadcaster_user_id": "1337",
                "broadcaster_user_login": "cool_user",
                "broadcaster_user_name": "Cool_User",
                "title": poll.title,

                "choices": poll.choices.map(({ title, id }) => ({ title, id, votes: 0 })),
                "bits_voting": {
                    "is_enabled": true,
                    "amount_per_vote": 10
                },
                "channel_points_voting": {
                    "is_enabled": true,
                    "amount_per_vote": 10
                },
                "status": "completed",
                "started_at": "2020-07-15T17:16:03.17106713Z",
                "ended_at": "2020-07-15T17:16:11.17106713Z"
            }
        }
    }

    async initPoll({ user, options, question }: { user: User, options: string[], question: string }) {
        const pollOptions = {
            broadcaster_id: user.sub,
            title: question,
            choices: options.map((option) => ({ title: option })),
            duration: 120
        }
        const response = await this.twitchRepository.initPoll(user.access_token, pollOptions)

        // console.log(JSON.stringify(this.createMockedPoll(response.data[0])))
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
