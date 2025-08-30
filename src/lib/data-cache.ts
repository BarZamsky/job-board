type CacheTag =
    | 'users'
    | 'organizations'
    | 'jobListings'
    | 'userNotificationsSettings'
    | 'userResume'
    | 'jobListingApplications'
    | 'organizationUserSettings'

export const getGlobalTag = (tag: CacheTag) => {
    return `global:${tag}` as const
}

export const getIdTag = (tag: CacheTag, id: string) => {
    return `id:${id}-${tag}` as const
}

export const getOrganizationTag = (tag: CacheTag, orgId: string) => {
    return `org:${orgId}-${tag}` as const
}

export const getJobListingTag = (tag: CacheTag, jobListingId: string) => {
    return `jobListing:${jobListingId}-${tag}` as const
}