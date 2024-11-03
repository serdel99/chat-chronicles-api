import { Body, Controller, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { WebhooksValidator } from './hmac.guard';

import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('webhooks')
export class WebhooksController {

    constructor(private eventEmmitter: EventEmitter2) {
    }

    @Post()
    // @UseGuards(WebhooksValidator)
    async processResponse(@Body() body) {
        this.eventEmmitter.emit(body.subscription.type, body.event)
        return ''
    }
}
