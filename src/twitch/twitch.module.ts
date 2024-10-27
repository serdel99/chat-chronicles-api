import { Module } from '@nestjs/common';

import { TwitchService } from 'src/twitch/twitch.service';
import { TwitchRepository } from './twitch.repository';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule],
    exports: [TwitchService, TwitchRepository],
    providers: [TwitchRepository, TwitchService]
})
export class TwitchModule { }
