import { env } from "node:process";

process.loadEnvFile();

type APIConfig = {
    dbURL: string;
    fileserverHits: number;
};

export const config: APIConfig = {
    dbURL: envOOrThrow('DB_URL'),
    fileserverHits: 0,
};

function envOOrThrow(key: string): string {
    if (!process.env){
        throw new Error(`env key not found: ${key}`);
    }

    return process.env[key] as string;
}