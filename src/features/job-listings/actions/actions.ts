'use server'

import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { JobListingFormValues, jobListingSchema } from './schemas'
import { redirect } from 'next/navigation'
import { insertJobListing } from '../db/job-listings'

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
