import { getGlobalTag, getIdTag } from '@/lib/data-cache'
import { revalidateTag } from 'next/cache'

export const getOrgGlobalTag = () => {
    return getGlobalTag('organizations')
}

export const getOrgTag = (orgId: string) => {
    return getIdTag('organizations', orgId)
}

export const revalidateOrgCache = (orgId: string) => {
    revalidateTag(getOrgTag(orgId))
    revalidateTag(getOrgGlobalTag())
}
