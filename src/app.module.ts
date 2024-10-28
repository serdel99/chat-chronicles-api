import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoryController } from './story/story.controller';
import { StoryService } from './story/story.service';
import { AuthModule } from './auth/auth.module';
import { TwitchModule } from './twitch/twitch.module';
import { DatabaseService } from './database/database.service';
import { OpeniaService } from './openia/openia.service';
import { StoryRepository } from './story/story.repository';


@Module({
  imports: [ConfigModule, HttpModule, AuthModule, TwitchModule],
  controllers: [AppController, StoryController],
  providers: [AppService, StoryService, StoryRepository, DatabaseService, OpeniaService],
})
export class AppModule { }
