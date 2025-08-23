import { serve } from 'inngest/next'
import { inngest } from '@/services/inngest/client'
import {
    clerkCreateOrganization,
    clerkCreateUser,
    clerkDeleteOrganization,
    clerkDeleteUser,
    clerkUpdateOrganization,
    clerkUpdateUser,
} from '@/services/inngest/functions/clerk'

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        clerkCreateUser,
        clerkUpdateUser,
        clerkDeleteUser,
        clerkCreateOrganization,
        clerkUpdateOrganization,
        clerkDeleteOrganization,
    ],
})
