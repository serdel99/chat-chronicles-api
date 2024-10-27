import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { TwitchService } from './twitch/twitch.service';
import { TwitchRepository } from './twitch/twitch.repository';
import { AuthModule } from './auth/auth.module';
import { TwitchModule } from './twitch/twitch.module';


@Module({
  imports: [ConfigModule, HttpModule, AuthModule, TwitchModule],
  controllers: [AppController, StoryController],
  providers: [AppService, StoryService],
})
export class AppModule { }
