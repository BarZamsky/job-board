import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"

export const insertUser = async (user: typeof UserTable.$inferInsert) => {
    await db.insert(UserTable).values(user).onConflictDoUpdate({
        target: UserTable.id,
        set: user,
    })
}
