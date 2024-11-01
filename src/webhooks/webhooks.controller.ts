import { Body, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { WebhooksValidator } from './hmac.guard';

@Controller('webhooks')
export class WebhooksController {

    @Post()
    @UseGuards(WebhooksValidator)
    async processResponse(@Body() Body) {
        Logger.log(Body);
        return "test"
    }
}
