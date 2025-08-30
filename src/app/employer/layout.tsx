import { ClipboardListIcon, PlusIcon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import Link from 'next/link'
import { SidebarNavMenuGroup } from '@/components/sidebar/SidebarNavMenuGroup'
import { SidebarOrgButton } from '@/features/organizations/components/SidebarOrgButton'
import { Suspense } from 'react'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { redirect } from 'next/navigation'
import { AsyncIf } from '@/components/AsyncIf'
import { hasOrgUserPermission } from '@/services/clerk/lib/org-user-permissions'
import { getJobListingOrganizationTag } from '@/features/job-listings/db/cache/job-listings'
import { db } from '@/drizzle/db'
import { JobListingApplicationTable, JobListingStatus, JobListingTable } from '@/drizzle/schema'
import { count, eq, desc } from 'drizzle-orm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getJobListingApplicationJobListingTag } from '@/features/job-listing-applications/cache/job-listing-applications'
import { sortJobListingStatus } from '@/features/job-listings/lib/utils'
import { JobListingMenuGroup } from './_JobListingMenuGroup'

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense>
            <LayoutSuspense>{children}</LayoutSuspense>
        </Suspense>
    )
}

async function LayoutSuspense({ children }: { children: React.ReactNode }) {
    const { orgId } = await getCurrentOrganization()
    if (orgId == null) {
        return redirect('/organizations/select')
    }

    return (
        <AppSidebar
            content={
                <>
                    <SidebarGroup>
                        <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
                        <AsyncIf condition={() => hasOrgUserPermission('job_listings:job_listings_create')}>
                            <SidebarGroupAction title="Add Job Listing" asChild>
                                <Link href="/employer/job-listings/new">
                                    <PlusIcon /> <span className="sr-only">Add Job Listing</span>
                                </Link>
                            </SidebarGroupAction>
                        </AsyncIf>
                        <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
                            <Suspense>
                                <JobListingMenu orgId={orgId} />
                            </Suspense>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarNavMenuGroup
                        className="mt-auto"
                        items={[
                            {
                                href: '/',
                                icon: <ClipboardListIcon />,
                                label: 'Job Board',
                            },
                        ]}
                    />
                </>
            }
            footerButton={<SidebarOrgButton />}
        >
            {children}
        </AppSidebar>
    )
}

async function JobListingMenu({ orgId }: { orgId: string }) {
    const jobListings = await getJobListings(orgId)
    if (!jobListings?.length && (await hasOrgUserPermission('job_listings:job_listings_create'))) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/employer/job-listings/create">
                            <PlusIcon /> <span>Create your first job listing</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    // Group job listings by status using reduce (compatible with ES2017)
    const groupedJobListings = jobListings.reduce(
        (acc, jobListing) => {
            const status = jobListing.status
            if (!acc[status]) {
                acc[status] = []
            }
            acc[status].push(jobListing)
            return acc
        },
        {} as Record<JobListingStatus, typeof jobListings>
    )

    return Object.entries(groupedJobListings)
        .sort(([a], [b]) => sortJobListingStatus(a as JobListingStatus, b as JobListingStatus))
        .map(([status, jobListings]) => (
            <JobListingMenuGroup key={status} status={status as JobListingStatus} jobListings={jobListings} />
        ))
}

async function getJobListings(orgId: string) {
    'use cache'
    cacheTag(getJobListingOrganizationTag(orgId))

    const data = await db
        .select({
            id: JobListingTable.id,
            title: JobListingTable.title,
            status: JobListingTable.status,
            applicationCount: count(JobListingApplicationTable.userId),
        })
        .from(JobListingTable)
        .where(eq(JobListingTable.organizationId, orgId))
        .leftJoin(JobListingApplicationTable, eq(JobListingTable.id, JobListingApplicationTable.jobListingId))
        .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
        .orderBy(desc(JobListingTable.createdAt))

    data.forEach((jobListing) => {
        cacheTag(getJobListingApplicationJobListingTag(jobListing.id))
    })
    return data
}
