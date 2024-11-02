import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database/database.service';
import { OpeniaService } from './openia/openia.service';
import { StoryRepository } from './story/story.repository';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationService } from './notification/notification.service';
import { PollListener } from './twitch/listeners/polls.listener';
import { TwitchRepository } from './twitch/twitch.repository';
import { TwitchService } from './twitch/twitch.service';


@Module({
  imports: [ConfigModule, HttpModule, AuthModule, EventEmitterModule.forRoot(), WebhooksModule],
  controllers: [AppController, StoryController],
  providers: [
    AppService,
    StoryService,
    StoryRepository,
    DatabaseService,
    OpeniaService,
    NotificationService,
    TwitchRepository,
    TwitchService,
    PollListener
  ],

})
export class AppModule { }
