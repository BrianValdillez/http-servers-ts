import { asc, eq } from 'drizzle-orm';
import { db } from "../index.js";
import { type ChirpEntry, type ChirpSelect, chirps } from "../schema.js";

export async function createChirp(body: string, userId: string): Promise<ChirpSelect> {
    const [newChirp] = await db.insert(chirps).values({
        body: body,
        userId: userId,
    }).returning();

    return newChirp;
}

export async function getAllChirps(): Promise<ChirpSelect[]>{
    return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}

export async function getChirp(chirpId: string): Promise<ChirpSelect | undefined>{
    const rows = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return (rows.length > 0 ? rows[0] : undefined);
}

export async function deleteChirp(chirpId: string) {
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}