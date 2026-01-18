import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(body: string, userId: string): Promise<NewChirp> {
    const [newChirp] = await db.insert(chirps).values({
        body: body,
        userId: userId,
    }).returning();

    return newChirp;
}