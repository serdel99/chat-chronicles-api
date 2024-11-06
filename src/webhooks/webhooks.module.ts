import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TwitchService } from 'src/twitch/twitch.service';

@Module({
  imports: [ConfigModule],
  controllers: [WebhooksController]
})
export class WebhooksModule { }
