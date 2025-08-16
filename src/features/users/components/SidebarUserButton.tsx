import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import { SidebarUserButtonClient } from './_SidebarUserButtonClient'

export function SidebarUserButton() {
    return (
        <Suspense>
            <SidebarUserSuspense />
        </Suspense>
    )
}

async function SidebarUserSuspense() {
    const { userId } = await auth()
    console.log(userId)
    return <SidebarUserButtonClient user={{ email: 'abc@email.com', name: 'kyle', imageUrl: '' }} />
}
