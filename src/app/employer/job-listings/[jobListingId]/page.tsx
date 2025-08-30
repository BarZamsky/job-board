import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { getJobListingTag } from '@/features/job-listings/db/cache/job-listings'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { and } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { JobListingStatus, JobListingTable } from '@/drizzle/schema'
import { Badge } from '@/components/ui/badge'
import { formatJobListingStatus } from '@/features/job-listings/lib/formatters'
import { JobListingBadges } from '@/features/job-listings/components/JobListingBadges'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EditIcon, EyeIcon, EyeOffIcon, StarIcon, StarOffIcon, Trash2Icon } from 'lucide-react'
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer'
import { MarkdownPartial } from '@/components/markdown/MarkdownPartial'
import { AsyncIf } from '@/components/AsyncIf'
import { hasOrgUserPermission } from '@/services/clerk/lib/org-user-permissions'
import { getNextJobListingStatus } from '@/features/job-listings/lib/utils'
import {
    hasReachedMaxFeaturedJobListings,
    hasReachedMaxPublishedJobListings,
} from '@/features/job-listings/lib/plan-feature-helpers'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ActionButton } from '@/components/ActionButton'
import {
    deleteJobListing,
    toggleJobListingFeatured,
    toggleJobListingStatus,
} from '@/features/job-listings/actions/actions'

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
                    <AsyncIf condition={() => hasOrgUserPermission('job_listings:job_listings_update')}>
                        <Button asChild variant="outline">
                            <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                                <EditIcon className="size-4" />
                                Edit
                            </Link>
                        </Button>
                    </AsyncIf>
                    <StatusUpdateButton status={jobListing.status} jobListingId={jobListing.id} />
                    {jobListing.status === 'published' && (
                        <FeaturedToggleButton isFeatured={jobListing.isFeatured} jobListingId={jobListing.id} />
                    )}
                    <AsyncIf condition={() => hasOrgUserPermission('job_listings:job_listings_delete')}>
                        <ActionButton
                            action={deleteJobListing.bind(null, jobListing.id)}
                            requireAreYouSure
                            variant="destructive"
                        >
                            <Trash2Icon className="size-4" />
                            Delete
                        </ActionButton>
                    </AsyncIf>
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

function StatusUpdateButton({ status, jobListingId }: { status: JobListingStatus; jobListingId: string }) {
    const ButtonComponent = (
        <ActionButton
            action={toggleJobListingStatus.bind(null, jobListingId)}
            variant="outline"
            requireAreYouSure={getNextJobListingStatus(status) === 'published'}
            areYouSureDescription="This will immediatly show this job listing to all users."
        >
            {statusToggleButtonText(status)}
        </ActionButton>
    )

    return (
        <AsyncIf condition={() => hasOrgUserPermission('job_listings:job_listings_change_status')}>
            {getNextJobListingStatus(status) === 'published' ? (
                <AsyncIf
                    condition={async () => {
                        const isMaxed = await hasReachedMaxPublishedJobListings()
                        return !isMaxed
                    }}
                    otherwise={
                        <UpgradePopover
                            buttonText={statusToggleButtonText(status)}
                            popoverText="You must upgrade your plan to post more job listings."
                        />
                    }
                >
                    {ButtonComponent}
                </AsyncIf>
            ) : (
                ButtonComponent
            )}
        </AsyncIf>
    )
}

function FeaturedToggleButton({ isFeatured, jobListingId }: { isFeatured: boolean; jobListingId: string }) {
    const ButtonComponent = (
        <ActionButton action={toggleJobListingFeatured.bind(null, jobListingId)} variant="outline">
            {featuredToggleButtonText(isFeatured)}
        </ActionButton>
    )

    return (
        <AsyncIf condition={() => hasOrgUserPermission('job_listings:job_listings_change_status')}>
            {isFeatured ? (
                ButtonComponent
            ) : (
                <AsyncIf
                    condition={async () => {
                        const isMaxed = await hasReachedMaxFeaturedJobListings()
                        return !isMaxed
                    }}
                    otherwise={
                        <UpgradePopover
                            buttonText={featuredToggleButtonText(isFeatured)}
                            popoverText="You must upgrade your plan to feature more job listings."
                        />
                    }
                >
                    {ButtonComponent}
                </AsyncIf>
            )}
        </AsyncIf>
    )
}

function UpgradePopover({ buttonText, popoverText }: { buttonText: React.ReactNode; popoverText: React.ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">{buttonText}</Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
                {popoverText}
                <Button asChild>
                    <Link href="/employer/pricing">Upgrade Plan</Link>
                </Button>
            </PopoverContent>
        </Popover>
    )
}
async function getJobListing(orgId: string, jobListingId: string) {
    'use cache'
    cacheTag(getJobListingTag(jobListingId))

    return db.query.JobListingTable.findFirst({
        where: and(eq(JobListingTable.id, jobListingId), eq(JobListingTable.organizationId, orgId)),
    })
}

function statusToggleButtonText(status: JobListingStatus) {
    switch (status) {
        case 'draft':
        case 'delisted':
            return (
                <>
                    <EyeIcon className="size-4" /> Publish
                </>
            )
        case 'published':
            return (
                <>
                    <EyeOffIcon className="size-4" /> Delist
                </>
            )
    }
}

function featuredToggleButtonText(isFeatured: boolean) {
    return isFeatured ? (
        <>
            <StarOffIcon className="size-4" /> UnFeature
        </>
    ) : (
        <>
            <StarIcon className="size-4" /> Feature
        </>
    )
}
