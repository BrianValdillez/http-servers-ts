import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { UserEntry, UserInfo, users } from "../schema.js";


export async function createUser(user: UserEntry): Promise<UserEntry> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
    
  return result;
}

export async function resetUsers(){
    await db.delete(users);
}

export async function getUser(email: string): Promise<UserEntry>{
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}