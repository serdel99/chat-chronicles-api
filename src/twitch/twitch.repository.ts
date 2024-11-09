import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateCustomRewardResponse, CreatePollResponse, GetUserAccessTokenDto, User } from './dto/twitchApiReponses';
import qs from 'qs';
import { CreatePollBody } from './dto/twitchApiRequests';
import axios from 'axios';
import { error } from 'console';


@Injectable()
export class TwitchRepository implements OnApplicationBootstrap {

    private accessToken?: string
    private clientId?: string
    private clientSecret: string
    private baseUrl: string
    private
    private logger = new Logger("TwitchRepository")


    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get("TWITCH_API_BASE_URL");
        this.httpService.axiosRef.interceptors.response.use((response) => {
            return response
        }, (error) => {
            if (axios.isAxiosError(error)) {
                this.logger.error(`Error twitch api request ${error.config?.url}${error.response.data ? JSON.stringify(error.response?.data) : error.message}`)
            } else {
                this.logger.error(error);
            }
            return Promise.reject(error);
        })
    }


    async onApplicationBootstrap() {
        try {
            Logger.debug("Try to get twitch app access_token", "Twitch Repository",)
            if (this.configService.get("ENABLE_TWITCH_MOCK")) {
                this.clientId = this.configService.get("TWITCH_CLIENT_ID");
                return;
            }
            const { data } = await this.httpService.axiosRef.post("https://id.twitch.tv/oauth2/token", {
                client_id: this.configService.get("TWITCH_CLIENT_ID"),
                client_secret: this.configService.get("TWITCH_CLIENT_SECRET"),
                grant_type: "client_credentials"
            })
            this.clientId = this.configService.get("TWITCH_CLIENT_ID");
            this.clientSecret = this.configService.get("TWITCH_CLIENT_SECRET");
            this.accessToken = data.access_token
        }
        catch (e) {
            if (axios.isAxiosError(e)) {

                Logger.error("Error at request " + JSON.stringify(e.response.data), "Twitch Repository")

            } else {
                Logger.error(e.message, "Twitch Repository")
            }
        }
    }


    private getHeaders(access_token) {
        return {
            'Client-Id': this.clientId,
            Authorization: `Bearer ${access_token}`,
        }
    }

    async getUser({ access_token }: { access_token: string }): Promise<User> {
        const response = await this.httpService.axiosRef.get<{ data: User[] }>(`${this.baseUrl}/users`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Client-Id': this.clientId
            }
        })
        return response.data.data[0];
    }

    async getOauthTokens(code: string): Promise<GetUserAccessTokenDto> {
        const body = {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: this.configService.get("TWITCH_REDIRECT_URL")
        }
        const response = await this.httpService.axiosRef.post<GetUserAccessTokenDto>(
            "https://id.twitch.tv/oauth2/token", qs.stringify(body), {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
        Logger.log(response.data, "Oauth tokens");
        return response.data
    }

    async createCustomReward({ user, reward }: { user: Express.Request["user"], reward: { title: string, cost: number } }): Promise<CreateCustomRewardResponse> {
        this.logger.debug(`Create custom reward for user ${user.sub}`)
        const response = await this.httpService.axiosRef.post<CreateCustomRewardResponse>(`${this.baseUrl}/channel_points/custom_rewards?broadcaster_id=${user.sub}`, reward, { headers: this.getHeaders(user.access_token) })
        return response.data
    }

    async initPoll(acces_token, data: CreatePollBody): Promise<CreatePollResponse> {
        const response = await this.httpService.axiosRef.post(`${this.baseUrl}/polls`, data, { headers: this.getHeaders(acces_token) })
        return response.data
    }

    async subscribeEvent({ data }) {
        try {
            const response = await this.httpService.axiosRef.post(`${this.baseUrl}/eventsub/subscriptions`, data, { headers: this.getHeaders(this.accessToken) })
            return response;
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 409) {
                    this.logger.log(`subscription already exists`)
                    return;
                }
            }
            throw e;
        }
    }

    async getSubscriptions() {
        const response = await this.httpService.axiosRef.get(`${this.baseUrl}/eventsub/subscriptions`, { headers: this.getHeaders(this.accessToken) })
        return response.data;
    }

}
