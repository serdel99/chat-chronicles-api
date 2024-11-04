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
