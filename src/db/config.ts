import type { MigrationConfig } from "drizzle-orm/migrator";

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/out",
};

export type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,
};