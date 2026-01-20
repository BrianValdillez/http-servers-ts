import { env } from "node:process";
import { DBConfig, migrationConfig } from "./db/config.js";

process.loadEnvFile();

type APIConfig = {
    fileserverHits: number;
    platform: string;
    secret: string;
};

type Config = {
    api: APIConfig;
    db: DBConfig;
};

export const config: Config = {
    api: {
        fileserverHits: 0,
        platform: envOrThrow('PLATFORM'),
        secret: envOrThrow('SECRET'),
    },
    db: {
        url: envOrThrow('DB_URL'),
        migrationConfig: migrationConfig,
    },
};

function envOrThrow(key: string): string {
    if (!process.env){
        throw new Error(`env key not found: ${key}`);
    }

    return process.env[key] as string;
}