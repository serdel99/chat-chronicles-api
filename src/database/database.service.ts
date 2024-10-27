import { neon } from "@neondatabase/serverless";
import { ConfigService } from "@nestjs/config";

export class DatabaseService {
    private readonly sql;

    constructor(private configService: ConfigService) {
        // const databaseUrl = this.configService.get('DATABASE_URL');
        // this.sql = neon(databaseUrl);
    }
}