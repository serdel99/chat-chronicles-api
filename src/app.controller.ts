import { Controller, Body, Post, Next, Logger, Res, UnauthorizedException, Request, UseGuards, } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import axios from 'axios';
import { AuthGuard } from './auth/auth.guard';


@Controller()
export class AppController {
  constructor() { }


}
