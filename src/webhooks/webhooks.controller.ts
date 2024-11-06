import { Body, Controller, Logger, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { WebhooksValidator } from './hmac.guard';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { TwitchService } from 'src/twitch/twitch.service';

const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

@Controller('webhooks')
export class WebhooksController {

    private logger = new Logger("Webhookcontroller");

    constructor(private eventEmmitter: EventEmitter2,) {
    }
    @Post()
    @UseGuards(WebhooksValidator)
    async processResponse(@Body() body, @Res() response, @Req() req) {

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            Logger.log(`Webhook ${body.subscription.type}`)

            this.eventEmmitter.emit(body.subscription.type, body)
            response.sendStatus(204);
        } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            response.set('Content-Type', 'text/plain').status(200).send(body.challenge);
        } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {

            Logger.log(`${body.subscription.type} notifications revoked!`);
            Logger.log(`reason: ${body.subscription.status}`);

            response.sendStatus(204);
        } else {
            response.sendStatus(204);

            Logger.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
        }
    }


}
