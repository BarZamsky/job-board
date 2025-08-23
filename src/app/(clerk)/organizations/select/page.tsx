import { OrganizationList } from '@clerk/nextjs'
import { Suspense } from 'react'

type Props = {
    searchParams: Promise<{
        redirect?: string
    }>
}

export default function OrganizationsSelectPage(props: Props) {
    return (
        <Suspense>
            <OrganizationsSelectPageSuspened {...props} />
        </Suspense>
    )
}

async function OrganizationsSelectPageSuspened({ searchParams }: Props) {
    const { redirect } = await searchParams
    const redirectUrl = redirect ?? '/employer'

    return (
        <OrganizationList
            hidePersonal
            hideSlug
            skipInvitationScreen
            afterSelectOrganizationUrl={redirectUrl}
            afterCreateOrganizationUrl={redirectUrl}
        />
    )
}
