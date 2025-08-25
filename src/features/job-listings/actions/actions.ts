'use server'

import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { JobListingFormValues, jobListingSchema } from './schemas'
import { redirect } from 'next/navigation'
import { insertJobListing, updateJobListing as updateJobListingDb } from '../db/job-listings'
import { getJobListingTag } from '../db/cache/job-listings'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { and } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

export const createJobListing = async (formData: JobListingFormValues) => {
    const { orgId } = await getCurrentOrganization()
    if (!orgId) {
        return {
            error: true,
            message: 'You dont have permission to create a job listing',
        }
    }

    const { success, data } = jobListingSchema.safeParse(formData)
    if (!success) {
        return {
            error: true,
            message: 'Invalid form data',
        }
    }
    const jobListing = await insertJobListing({
        ...data,
        organizationId: orgId,
        status: 'draft',
    })

    redirect(`/employer/job-listings/${jobListing.id}`)
}

export const updateJobListing = async (id: string, formData: JobListingFormValues) => {
    const { orgId } = await getCurrentOrganization()
    if (!orgId) {
        return {
            error: true,
            message: 'You dont have permission to update a job listing',
        }
    }

    const { success, data } = jobListingSchema.safeParse(formData)
    if (!success) {
        return {
            error: true,
            message: 'Invalid form data',
        }
    }

    const existingJobListing = await getJobListing(id, orgId)
    const updatedJobListing = await updateJobListingDb(id, {
        ...existingJobListing,
        ...data,
    })

    redirect(`/employer/job-listings/${updatedJobListing.id}`)
}

const getJobListing = async (id: string, orgId: string) => {
    'use cache'
    cacheTag(getJobListingTag(id))

    return db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, id), eq(JobListingTable.organizationId, orgId)),
    })
}
