import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { TwitchService } from './twitch/twitch.service';
import { TwitchRepository } from './twitch/twitch.repository';


@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController, StoryController],
  providers: [AppService, StoryService, TwitchService, TwitchRepository],
})
export class AppModule { }
