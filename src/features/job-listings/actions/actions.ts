'use server'

import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { JobListingFormValues, jobListingSchema } from './schemas'
import { redirect } from 'next/navigation'
import {
    deleteJobListing as deleteJobListingDb,
    insertJobListing,
    updateJobListing as updateJobListingDb,
} from '../db/job-listings'
import { getJobListingTag } from '../db/cache/job-listings'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { db } from '@/drizzle/db'
import { JobListingTable } from '@/drizzle/schema'
import { and } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { hasOrgUserPermission } from '@/services/clerk/lib/org-user-permissions'
import { getNextJobListingStatus } from '../lib/utils'
import { hasReachedMaxFeaturedJobListings } from '../lib/plan-feature-helpers'
import { hasReachedMaxPublishedJobListings } from '../lib/plan-feature-helpers'

export const createJobListing = async (formData: JobListingFormValues) => {
    const { orgId } = await getCurrentOrganization()
    if (!orgId || !(await hasOrgUserPermission('job_listings:job_listings_create'))) {
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
    if (!orgId || !(await hasOrgUserPermission('job_listings:job_listings_update'))) {
        return {
            error: true,
            message: 'You dont have permission to update this job listing',
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
    if (!existingJobListing) {
        return {
            error: true,
            message: 'There was an error updating the job listing',
        }
    }

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

export const toggleJobListingStatus = async (id: string) => {
    const error = {
        error: true,
        message: 'You dont have permission to change the status of this job listing',
    }

    const { orgId } = await getCurrentOrganization()
    if (!orgId || !(await hasOrgUserPermission('job_listings:job_listings_change_status'))) {
        return error
    }

    const jobListing = await getJobListing(id, orgId)
    if (!jobListing) return error

    const nextStatus = getNextJobListingStatus(jobListing.status)
    if (
        !(await hasOrgUserPermission('job_listings:job_listings_change_status')) ||
        (nextStatus === 'published' && (await hasReachedMaxPublishedJobListings()))
    ) {
        return error
    }

    await updateJobListingDb(id, {
        status: nextStatus,
        isFeatured: nextStatus === 'published' ? undefined : false,
        postedAt: nextStatus === 'published' && !jobListing.postedAt ? new Date() : undefined,
    })

    return { error: false }
}

export const toggleJobListingFeatured = async (id: string) => {
    const error = {
        error: true,
        message: 'You dont have permission to change the featured status of this job listing',
    }

    const { orgId } = await getCurrentOrganization()
    if (!orgId || !(await hasOrgUserPermission('job_listings:job_listings_change_status'))) {
        return error
    }

    const jobListing = await getJobListing(id, orgId)
    if (!jobListing) return error

    const newFeaturedStatus = !jobListing.isFeatured
    if (
        !(await hasOrgUserPermission('job_listings:job_listings_change_status')) ||
        (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
    ) {
        return error
    }

    await updateJobListingDb(id, {
        isFeatured: newFeaturedStatus,
    })

    return { error: false }
}

export const deleteJobListing = async (id: string) => {
    const error = {
        error: true,
        message: 'You dont have permission to delete this job listing',
    }

    const { orgId } = await getCurrentOrganization()
    if (!orgId) return error

    const jobListing = await getJobListing(id, orgId)
    if (!jobListing) return error

    if (!(await hasOrgUserPermission('job_listings:job_listings_delete'))) {
        return error
    }

    await deleteJobListingDb(id)

    redirect('/employer')
}
