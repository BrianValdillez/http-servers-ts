import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { type RefreshTokenEntry, refreshTokens, RefreshTokenSelect } from "../schema.js";

export async function registerRefreshToken(tokenEntry: RefreshTokenEntry){
    await db.insert(refreshTokens).values(tokenEntry).returning();
}

export async function revokeRefreshToken(token: string){
    await db.update(refreshTokens).set({
        revokedAt: new Date(),
    }).where(eq(refreshTokens.token, token));
}

export async function getRefreshToken(token: string): Promise<RefreshTokenSelect>{
        const [tokenEntry] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
        return tokenEntry;
}