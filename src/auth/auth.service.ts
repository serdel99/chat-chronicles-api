import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { TwitchService } from 'src/twitch/twitch.service';
import jwksClient from 'jwks-rsa'

@Injectable()
export class AuthService {

    private client = jwksClient({
        jwksUri: 'https://id.twitch.tv/oauth2/keys',
    });

    constructor(
        private twitchService: TwitchService,
        private configService: ConfigService
    ) { }

    // async login(code) {

    //     const { access_token, refresh_token } = await this.twitchService.getAccessToken(code);

    //     const user = await this.twitchService.getUser({ access_token })


    //     const result = await this.prisma.user.upsert({
    //         create: {
    //             display_name: user.display_name,
    //             twitch_id: user.id,
    //             access_token: this.jwtService.sign(access_token),
    //             refresh_token: this.jwtService.sign(refresh_token),
    //         }, where: {
    //             twitch_id: user.id
    //         },
    //         update: undefined
    //     })




    //     console.log();



    //     return {
    //         user,
    //         access_token: this.jwtService.sign({ ...user, code })
    //     }
    // }

    private getKey(header) {

        return new Promise<string>((resolve, reject) => {
            this.client.getSigningKey(header.kid, (err, key) => {
                if (err) {
                    return reject(err);
                }
                const signingKey = key.getPublicKey();
                resolve(signingKey);
            });
        })

    }

    private validateJWT(idToken, publicKey) {

        return new Promise((resolve, reject) => {
            jwt.verify(
                idToken, publicKey, { algorithms: ["RS256"], ignoreExpiration: true },
                (error, decoded) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(decoded)
                }
            );
        })
    }

    async validateIdToken(idToken: string): Promise<any> {

        try {

            const decoded = jwt.decode(idToken, { complete: true });
            const publicKey = await this.getKey(decoded.header.kid)

            await this.validateJWT(idToken, publicKey);

            return decoded

        } catch (e) {
            Logger.log(e);
            throw new UnauthorizedException();
        }
    }
}
