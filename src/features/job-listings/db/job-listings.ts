import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { revalidateJobListingCache } from './cache/job-listings'

export const insertJobListing = async (jobListing: typeof JobListingTable.$inferInsert) => {
    const [newJobListing] = await db.insert(JobListingTable).values(jobListing).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.organizationId,
    })
    revalidateJobListingCache(newJobListing)
    return newJobListing
}
