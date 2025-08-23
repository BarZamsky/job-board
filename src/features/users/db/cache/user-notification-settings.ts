import { getGlobalTag, getIdTag } from '@/lib/data-cache'
import { revalidateTag } from 'next/cache'

export const getUserNotificationSettingsGlobalTag = () => {
    return getGlobalTag('userNotificationsSettings')
}

export const getUserNotificationSettingsTag = (userId: string) => {
    return getIdTag('userNotificationsSettings', userId)
}

export const revalidateUserNotificationSettingsCache = (userId: string) => {
    revalidateTag(getUserNotificationSettingsTag(userId))
    revalidateTag(getUserNotificationSettingsGlobalTag())
}
