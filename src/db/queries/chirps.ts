import { asc } from 'drizzle-orm';
import { db } from "../index.js";
import { ChirpEntry, chirps } from "../schema.js";

export async function createChirp(body: string, userId: string): Promise<ChirpEntry> {
    const [newChirp] = await db.insert(chirps).values({
        body: body,
        userId: userId,
    }).returning();

    return newChirp;
}

export async function getAllChirps(): Promise<ChirpEntry[]>{
    return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
}