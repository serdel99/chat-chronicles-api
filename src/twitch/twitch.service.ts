import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TwitchRepository } from './twitch.repository';
import { User } from 'src/auth/types/user';
import { ConfigService } from '@nestjs/config';
import { Powerups } from 'src/story/powerups/porwerups.definitions';
import { title } from 'process';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TwitchService {

    private logger = new Logger("TwichService");


    constructor(
        private twitchRepository: TwitchRepository,
        private configService: ConfigService,
        private databaseService: DatabaseService
    ) { }

    async getAccessToken(codeToken: string) {
        return this.twitchRepository.getOauthTokens(codeToken);
    }

    async getUser({ access_token }) {
        return this.twitchRepository.getUser({ access_token });
    }

    async createCustomRewards({ user }: { user: Express.Request["user"] }) {
        try {
            const createdUser = await this.databaseService.user.findFirst({ where: { id: user.sub } })
            if (!createdUser) {
                this.logger.debug(`New User ${user.sub} creating rewards`)
                const reward = Object.values(Powerups).map((reward) => this.twitchRepository.createCustomReward({ user, reward: { title: reward.title, cost: reward.cost } }))
                const rewards = await Promise.all(reward)
                await this.databaseService.user.create({
                    data: {
                        id: user.sub,
                        rewards: rewards.map((reward) => ({
                            title: reward.data[0].title,
                            cost: reward.data[0].cost,
                            id: reward.data[0].id
                        }))
                    }
                })
            } else {
                this.logger.debug(`User ${user.sub} get rewards`)
            }
            return;

        } catch (e) {
            this.logger.error(e.message)
            throw new InternalServerErrorException();
        }
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
        await this.twitchRepository.subscribeEvent({ data });
        return;

    }

    async subscribeMessageEvent({ user }: { user: Express.Request["user"] }) {
        const data = {
            type: "channel.chat.message",
            version: "1",
            condition: {
                "broadcaster_user_id": user.sub,
                "user_id": user.sub,
            },
            transport: {
                "method": "webhook",
                "callback": this.configService.getOrThrow("TWITCH_CALLBACK_URL"),
                "secret": this.configService.getOrThrow("TWITCH_WEBHOOK_SECRET"),
            }
        }

        const res = await this.twitchRepository.subscribeEvent({ data });
        return res.data
    }

    async getSubscriptions() {
        const res = await this.twitchRepository.getSubscriptions()
        return res
    }

}
