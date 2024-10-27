import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GetUserAccessTokenDto, User } from './dto/twitchApiReponses';
import qs from 'qs';


@Injectable()
export class TwitchRepository implements OnApplicationBootstrap {

    private accessToken?: string
    private clientId?: string
    private clientSecret: string

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }



    async getUser({ access_token }: { access_token: string }): Promise<User> {
        const response = await this.httpService.axiosRef.get<{ data: User[] }>("https://api.twitch.tv/helix/users", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Client-Id': this.clientId
            }
        })

        Logger.log(response.data)

        return response.data.data[0];
    }

    async getOauthTokens(code: string): Promise<GetUserAccessTokenDto> {
        const body = {
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:5173"
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

            // const { data } = await this.httpService.axiosRef.post("https://id.twitch.tv/oauth2/token", {
            //     client_id: this.configService.get("TWITCH_CLIENT_ID"),
            //     client_secret: this.configService.get("TWITCH_CLIENT_SECRET"),
            //     grant_type: "client_credentials"
            // })


            this.clientId = this.configService.get("TWITCH_CLIENT_ID");
            this.clientSecret = this.configService.get("TWITCH_CLIENT_SECRET");
            this.accessToken = "quo8z45rtesfvuz13gu95br92khnur"

        }
        catch (e) {
            Logger.error(e, "Twitch Repository")
        }
    }
    initPoll() { }
}
