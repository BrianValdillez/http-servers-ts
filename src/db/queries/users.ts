import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { type UserEntry, type UserSelect, type UserUpdate, users } from "../schema.js";

export async function resetUsers(){
    await db.delete(users);
}

export async function createUser(user: UserEntry): Promise<UserSelect> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
    
  return result;
}

export async function getUser(email: string): Promise<UserSelect>{
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function updateUser(userId: string, userUpdate: UserUpdate): Promise<UserSelect>{
  const [user] = await db.update(users).set(userUpdate).where(eq(users.id, userId)).returning();
  return user;
}

export async function upgradeUser(userId: string){
  await db.update(users).set({ isChirpyRed: true}).where(eq(users.id, userId));
}