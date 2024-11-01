import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import crypto from 'crypto'


const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const HMAC_PREFIX = 'sha256=';

@Injectable()
export class WebhooksValidator implements CanActivate {

    constructor(private configService: ConfigService) { }

    getHmac(secret, message) {
        return crypto
            .createHmac("sha256", secret)
            .update(message)
            .digest("hex")
    }

    getHmacMessage(request: Request) {
        return (
            request.headers[TWITCH_MESSAGE_ID] as string +
            request.headers[TWITCH_MESSAGE_TIMESTAMP] +
            JSON.stringify(request.body)
        )
    }

    verifyMessage(hmac, verifySignature) {
        return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature))
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const secret = this.configService.getOrThrow("TWITCH_WEBHOOK_SECRET");
            const message = this.getHmacMessage(request)
            const hmacMessage = HMAC_PREFIX + this.getHmac(secret, message);
            return this.verifyMessage(hmacMessage, request.headers[TWITCH_MESSAGE_SIGNATURE])
        } catch (e) {
            Logger.log(e, "WebhookValidator")
            return false
        }
    }
}