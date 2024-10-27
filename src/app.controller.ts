import { Controller, Body, Post, Next, Logger, Res, UnauthorizedException, HttpStatus, } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import axios from 'axios';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }



  @Post('auth/login')
  async login(@Body() signInDto: { code: string }) {
    try {
      const response = await this.authService.login(signInDto.code)

      return response

    } catch (e) {
      if (axios.isAxiosError(e)) {
        Logger.error(e.response.data.message);
      } else {
        Logger.error(e);
      }
      Logger.log(e)
      throw new UnauthorizedException();
    }
  }

}
