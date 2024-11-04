import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreatePollResponse, GetUserAccessTokenDto, User } from './dto/twitchApiReponses';
import qs from 'qs';
import { CreatePollBody } from './dto/twitchApiRequests';
import axios from 'axios';


@Injectable()
export class TwitchRepository implements OnApplicationBootstrap {

    private accessToken?: string
    private clientId?: string
    private clientSecret: string
    private baseUrl: string


    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get("TWITCH_API_BASE_URL");
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


    async onApplicationBootstrap() {
        try {
            Logger.debug("Try to get twitch app access_token", "Twitch Repository",)
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

    async initPoll(acces_token, data: CreatePollBody): Promise<CreatePollResponse> {
        const response = await this.httpService.axiosRef.post(`${this.baseUrl}/polls`, data, { headers: this.getHeaders(acces_token) })
        return response.data
    }

    async subscribeEvent({ data, acces_token }) {
        const response = await this.httpService.axiosRef.post(`${this.baseUrl}/eventsub/subscriptions`, data, { headers: this.getHeaders(acces_token) })
        return response;
    }
}
