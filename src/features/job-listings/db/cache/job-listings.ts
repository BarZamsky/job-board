import { getGlobalTag, getIdTag, getOrganizationTag } from '@/lib/data-cache'
import { revalidateTag } from 'next/cache'

export const getJobListingGlobalTag = () => {
    return getGlobalTag('jobListings')
}

export const getJobListingOrganizationTag = (orgId: string) => {
    return getOrganizationTag('jobListings', orgId)
}

export const getJobListingTag = (jobListingId: string) => {
    return getIdTag('jobListings', jobListingId)
}

export const revalidateJobListingCache = ({ id, orgId }: { id: string; orgId: string }) => {
    revalidateTag(getJobListingTag(id))
    revalidateTag(getJobListingOrganizationTag(orgId))
    revalidateTag(getJobListingGlobalTag())
}
