import { JobListingTable } from '@/drizzle/schema'
import { desc } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import { db } from '@/drizzle/db'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getJobListingOrganizationTag, revalidateJobListingCache } from '@/features/job-listings/db/cache/job-listings'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

export default function EmployerHomePage() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    )
}

async function SuspendedPage() {
    const { orgId } = await getCurrentOrganization()
    if (orgId == null) return null

    const jobListings = await getMostRecentJobListings(orgId)
    if (jobListings == null) {
        redirect('/employer/job-listings/create')
    }

    return redirect(`/employer/job-listings/${jobListings.id}`)
}

async function getMostRecentJobListings(orgId: string) {
    'use cache'
    cacheTag(getJobListingOrganizationTag(orgId))

    return await db.query.JobListingTable.findFirst({
        where: eq(JobListingTable.organizationId, orgId),
        orderBy: desc(JobListingTable.createdAt),
        columns: {
            id: true,
        },
    })
}
