import { UserNotificationSettingsTable } from "@/drizzle/schema"
import { db } from "@/drizzle/db"

export const insertUserNotificationsSettings = async (settings: typeof UserNotificationSettingsTable.$inferInsert) => {
    await db.insert(UserNotificationSettingsTable).values(settings).onConflictDoNothing()
}