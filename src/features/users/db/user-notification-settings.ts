import { UserNotificationSettingsTable } from '@/drizzle/schema'
import { db } from '@/drizzle/db'
import { revalidateUserNotificationSettingsCache } from './cache/user-notification-settings'

export const insertUserNotificationsSettings = async (settings: typeof UserNotificationSettingsTable.$inferInsert) => {
    await db.insert(UserNotificationSettingsTable).values(settings).onConflictDoNothing()
    revalidateUserNotificationSettingsCache(settings.userId)
}
