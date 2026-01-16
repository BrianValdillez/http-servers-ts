import { env } from "node:process";
import { DBConfig, migrationConfig } from "./db/config.js";

process.loadEnvFile();

type APIConfig = {
    fileserverHits: number;
};

type Config = {
    api: APIConfig;
    db: DBConfig;
};

export const config: Config = {
    api: {
        fileserverHits: 0,
    },
    db: {
        url: envOOrThrow('DB_URL'),
        migrationConfig: migrationConfig,
    },
};

function envOOrThrow(key: string): string {
    if (!process.env){
        throw new Error(`env key not found: ${key}`);
    }

    return process.env[key] as string;
}