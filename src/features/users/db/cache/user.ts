import { getGlobalTag, getIdTag } from '@/lib/data-cache'
import { revalidateTag } from 'next/cache'

export const getUserGlobalTag = () => {
    return getGlobalTag('users')
}

export const getUserTag = (userId: string) => {
    return getIdTag('users', userId)
}

export const revalidateUserCache = (userId: string) => {
    revalidateTag(getUserTag(userId))
    revalidateTag(getUserGlobalTag())
}
