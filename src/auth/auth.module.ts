import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitchService } from 'src/twitch/twitch.service';
import { TwitchModule } from 'src/twitch/twitch.module';

@Module({
  imports: [
    PassportModule,
    TwitchModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_KEY")
      }),
    })],

  exports: [AuthService],
  providers: [AuthService, LocalStrategy, TwitchService]
})
export class AuthModule { }
