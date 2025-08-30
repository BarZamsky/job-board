import { JobListingStatus } from '@/drizzle/schema'

export const getNextJobListingStatus = (status: JobListingStatus) => {
    switch (status) {
        case 'draft':
        case 'delisted':
            return 'published'
        case 'published':
            return 'delisted'
        default:
            throw new Error(`Unknown job listing status: ${status}`)
    }
}

export const sortJobListingStatus = (a: JobListingStatus, b: JobListingStatus) => {
    return JOB_LISTING_STATUS_ORDER[a] - JOB_LISTING_STATUS_ORDER[b]
}

const JOB_LISTING_STATUS_ORDER = {
    published: 0,
    delisted: 1,
    draft: 2,
}
