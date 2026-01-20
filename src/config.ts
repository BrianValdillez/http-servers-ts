import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type Config = {
    api: APIConfig;
    db: DBConfig;
};

type APIConfig = {
    fileserverHits: number;
    platform: string;
    secret: string;
};

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/out",
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
    //console.log(`[ENV] ${key} => ${process.env[key]}`);

    return process.env[key] as string;
}