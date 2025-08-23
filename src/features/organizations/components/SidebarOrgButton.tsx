import { Suspense } from 'react'
import { SidebarOrgButtonClient } from './_SidebarOrgButtonClient'
import { getCurrentOrganization, getCurrentUser } from '@/services/clerk/lib/get-current-user'
import { SignOutButton } from '@/services/clerk/components/AuthButtons'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { LogOutIcon } from 'lucide-react'

export function SidebarOrgButton() {
    return (
        <Suspense>
            <SidebarOrgSuspense />
        </Suspense>
    )
}

async function SidebarOrgSuspense() {
    const [{ user }, { organization }] = await Promise.all([
        getCurrentUser({ allData: true }),
        getCurrentOrganization({ allData: true }),
    ])

    if (user == null || organization == null) {
        return (
            <SignOutButton>
                <SidebarMenuButton>
                    <LogOutIcon />
                    <span>Log Out</span>
                </SidebarMenuButton>
            </SignOutButton>
        )
    }

    return <SidebarOrgButtonClient user={user} organization={organization} />
}
