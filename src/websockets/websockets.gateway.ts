import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        cors: {
            origin: '*',
        },
    }
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private logger = new Logger("WebsocketGateway")
    @WebSocketServer()
    server: Server;

    constructor(private authService: AuthService) { }


    async handleConnection(client: Socket,) {
        try {
            const { payload: { sub } } = await this.authService.validateIdToken(client.request.headers['authorization'] as string);
            client.join(sub)
        } catch (e) {
            this.logger.log(e);
            client.disconnect();
        }
    }
    handleDisconnect(client: Socket) {

    }
}