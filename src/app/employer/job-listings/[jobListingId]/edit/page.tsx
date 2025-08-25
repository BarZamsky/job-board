import { Card, CardContent } from '@/components/ui/card'
import { JobListingForm } from '@/features/job-listings/components/JobListingForm'
import { getJobListingTag } from '@/features/job-listings/db/cache/job-listings'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { db } from '@/drizzle/db'
import { and, eq } from 'drizzle-orm'
import { JobListingTable } from '@/drizzle/schema'

type Props = {
    params: Promise<{ jobListingId: string }>
}

export default function EditJobListingPage(props: Props) {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Edit a job listing</h1>
            <Card>
                <CardContent>
                    <Suspense>
                        <SuspendedPage {...props} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}

async function SuspendedPage({ params }: Props) {
    const { jobListingId } = await params
    const { orgId } = await getCurrentOrganization()
    if (!orgId) return notFound()

    const jobListing = await getJobListing(orgId, jobListingId)
    if (!jobListing) return notFound()
    return <JobListingForm jobListing={jobListing} />
}

async function getJobListing(orgId: string, jobListingId: string) {
    'use cache'
    cacheTag(getJobListingTag(jobListingId))

    return db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, jobListingId), eq(JobListingTable.organizationId, orgId)),
    })
}
