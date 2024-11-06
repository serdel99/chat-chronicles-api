import { Controller, Get, InternalServerErrorException, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { WebhooksValidator } from './webhooks/hmac.guard';
import { TwitchService } from './twitch/twitch.service';
import axios from 'axios';
import { AuthGuard } from './auth/auth.guard';


@Controller()
export class AppController {
  constructor(private twitchService: TwitchService) { }

  @Get("ping")
  ping() {
    return "pong"
  }

  // @Post("/")
  // @UseGuards(AuthGuard)
  // async createSubscription(@Req() req) {
  //   try {
  //     const response = await this.twitchService.subscribeMessageEvent({ user: req.user });
  //     return response
  //   } catch (e) {
  //     if (axios.isAxiosError(e)) {
  //       Logger.log(e.toJSON())
  //     }
  //     Logger.log(e)
  //     throw new InternalServerErrorException();
  //   }
  // }

  // @Get("/subs")
  // @UseGuards(AuthGuard)
  // async getSubscriptions(@Req() req) {
  //   try {
  //     const response = await this.twitchService.getSubscriptions();
  //     return response
  //   } catch (e) {
  //     if (axios.isAxiosError(e)) {
  //       Logger.log(e.toJSON())
  //     } else {
  //       Logger.log(e)
  //     }
  //     throw new InternalServerErrorException();
  //   }
  // }
}
