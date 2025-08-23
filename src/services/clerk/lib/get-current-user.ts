import { db } from '@/drizzle/db'
import { OrganizationTable, UserTable } from '@/drizzle/schema'
import { getOrgTag } from '@/features/organizations/db/cache/organizations'
import { getUserTag } from '@/features/users/db/cache/user'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

export const getCurrentUser = async ({ allData = false } = {}) => {
    const { userId } = await auth()
    if (userId == null) {
        return {
            user: null,
        }
    }

    return {
        userId,
        user: allData ? await getUser(userId) : undefined,
    }
}

const getUser = async (userId: string) => {
    'use cache'
    cacheTag(getUserTag(userId))

    return await db.query.UserTable.findFirst({ where: eq(UserTable.id, userId) })
}

export const getCurrentOrganization = async ({ allData = false } = {}) => {
    const { orgId } = await auth()
    if (orgId == null) {
        return {
            organization: null,
        }
    }

    return {
        orgId,
        organization: allData ? await getOrganization(orgId) : undefined,
    }
}

const getOrganization = async (orgId: string) => {
    'use cache'
    cacheTag(getOrgTag(orgId))

    return await db.query.OrganizationTable.findFirst({ where: eq(OrganizationTable.id, orgId) })
}
