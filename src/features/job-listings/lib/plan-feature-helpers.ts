import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { and, count, eq } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getJobListingOrganizationTag } from '../db/cache/job-listings'
import { getPlanFeatures } from '@/services/clerk/lib/plan-features'

export const hasReachedMaxFeaturedJobListings = async () => {
    const { orgId } = await getCurrentOrganization()
    if (!orgId) return true

    const count = await getPublishedJobListingsCount(orgId)
    const canPost = await Promise.all([
        getPlanFeatures('post_1_job_listing').then((has) => has && count < 1),
        getPlanFeatures('post_3_job_listings').then((has) => has && count < 3),
        getPlanFeatures('post_15_job_listings').then((has) => has && count < 15),
    ])

    return !canPost.some(Boolean)
}

const getPublishedJobListingsCount = async (orgId: string) => {
    'use cache'
    cacheTag(getJobListingOrganizationTag(orgId))

    const [res] = await db
        .select({ count: count() })
        .from(JobListingTable)
        .where(and(eq(JobListingTable.organizationId, orgId), eq(JobListingTable.status, 'published')))

    return res?.count ?? 0
}
