import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { getJobListingTag } from '@/features/job-listings/db/cache/job-listings'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { and } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { JobListingTable } from '@/drizzle/schema'
import { Badge } from '@/components/ui/badge'
import { formatJobListingStatus } from '@/features/job-listings/lib/formatters'
import { JobListingBadges } from '@/features/job-listings/components/JobListingBadges'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditIcon } from 'lucide-react'
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer'
import { MarkdownPartial } from '@/components/markdown/MarkdownPartial'

type Props = {
    params: Promise<{ jobListingId: string }>
}

export default function JobListingPage(props: Props) {
    return (
        <Suspense>
            <SuspendedPage {...props} />
        </Suspense>
    )
}

async function SuspendedPage({ params }: Props) {
    const { orgId } = await getCurrentOrganization()
    if (!orgId) {
        return null
    }

    const { jobListingId } = await params
    const jobListing = await getJobListing(orgId, jobListingId)
    if (!jobListing) return notFound()

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
            <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{jobListing.title}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
                        <JobListingBadges jobListing={jobListing} />
                    </div>
                </div>
                <div className="flex items-center gap-2 empty:-mt-4">
                    <Button asChild variant="outline">
                        <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                            <EditIcon className="size-4" />
                            Edit
                        </Link>
                    </Button>
                </div>
            </div>

            <MarkdownPartial
                dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
                mainMarkdown={<MarkdownRenderer className="prose-sm" source={jobListing.description} />}
                dialogTitle="Job Description"
            />
        </div>
    )
}

async function getJobListing(orgId: string, jobListingId: string) {
    'use cache'
    cacheTag(getJobListingTag(jobListingId))

    return db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, jobListingId), eq(JobListingTable.organizationId, orgId)),
    })
}
