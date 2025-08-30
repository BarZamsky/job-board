import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { revalidateJobListingCache } from './cache/job-listings'
import { eq } from 'drizzle-orm'

export const insertJobListing = async (jobListing: typeof JobListingTable.$inferInsert) => {
    const [newJobListing] = await db.insert(JobListingTable).values(jobListing).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.organizationId,
    })
    revalidateJobListingCache(newJobListing)
    return newJobListing
}

export const updateJobListing = async (id: string, jobListing: Partial<typeof JobListingTable.$inferInsert>) => {
    const [updatedJobListing] = await db
        .update(JobListingTable)
        .set(jobListing)
        .where(eq(JobListingTable.id, id))
        .returning({
            id: JobListingTable.id,
            orgId: JobListingTable.organizationId,
        })
    revalidateJobListingCache(updatedJobListing)
    return updatedJobListing
}

export const deleteJobListing = async (id: string) => {
    const [deletedJobListing] = await db.delete(JobListingTable).where(eq(JobListingTable.id, id)).returning({
        id: JobListingTable.id,
        orgId: JobListingTable.organizationId,
    })
    revalidateJobListingCache(deletedJobListing)
    return deletedJobListing
}
