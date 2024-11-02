import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule,
  ],
  exports: [AuthService],
  providers: [AuthService]
})
export class AuthModule { }
