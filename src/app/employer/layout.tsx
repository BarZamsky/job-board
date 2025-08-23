import { ClipboardListIcon, PlusIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarGroupAction } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/AppSidebar'
import Link from 'next/link'
import { SidebarNavMenuGroup } from '@/components/sidebar/SidebarNavMenuGroup'
import { SidebarOrgButton } from '@/features/organizations/components/SidebarOrgButton'
import { Suspense } from 'react'
import { getCurrentOrganization } from '@/services/clerk/lib/get-current-user'
import { redirect } from 'next/navigation'

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
                        <SidebarGroupAction title="Add Job Listing" asChild>
                            <Link href="/employer/job-listings/create">
                                <PlusIcon /> <span className="sr-only">Add Job Listing</span>
                            </Link>
                        </SidebarGroupAction>
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
            <div>{children}</div>
        </AppSidebar>
    )
}
