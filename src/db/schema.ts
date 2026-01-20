import { pgTable, timestamp, text, varchar, uuid } from "drizzle-orm/pg-core";

export type UserEntry = typeof users.$inferInsert;
//export type UserSelect = typeof users.$inferSelect;
export type UserInfo = Omit<UserEntry, 'hashedPassword'>;
export type ChirpEntry = typeof chirps.$inferInsert;
export type RefreshTokenEntry = typeof refreshTokens.$inferInsert;
export type RefreshTokenSelect = typeof refreshTokens.$inferSelect;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar('hashed_password', { length: 128 }).notNull().default('unset'),
});

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text('body').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const refreshTokens = pgTable('refresh_tokens', {
  token: text('token').primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull().defaultNow(),
  revokedAt: timestamp('revoked_at'),
});