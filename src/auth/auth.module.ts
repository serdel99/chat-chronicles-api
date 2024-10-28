import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, } from '@nestjs/config';

import { TwitchModule } from 'src/twitch/twitch.module';

@Module({
  imports: [
    ConfigModule,
    TwitchModule,
  ],
  exports: [AuthService],
  providers: [AuthService]
})
export class AuthModule { }
