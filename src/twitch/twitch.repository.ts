import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TwitchRepository implements OnApplicationBootstrap {

    private accessToken?: string

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) { }


    asnyc

    async onApplicationBootstrap() {


        try {
            Logger.debug("Try to get twitch app access_token", "Twitch Repository",)

            // const { data } = await this.httpService.axiosRef.post("https://id.twitch.tv/oauth2/token", {
            //     client_id: this.configService.get("TWITCH_CLIENT_ID"),
            //     client_secret: this.configService.get("TWITCH_CLIENT_SECRET"),
            //     grant_type: "client_credentials"
            // })

            this.accessToken = "quo8z45rtesfvuz13gu95br92khnur"

        }
        catch (e) {
            Logger.error(e, "Twitch Repository")
        }
    }
    initPoll() { }
}
