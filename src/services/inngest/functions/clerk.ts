import { Webhook } from "svix";
import { inngest } from "../client";
import { env } from "@/data/env/server";
import { NonRetriableError } from "inngest";
import { insertUser } from "@/features/users/db/user";
import { insertUserNotificationsSettings } from "@/features/users/db/user-notification-settings";

const vertifyWebhook = async ({raw, headers}: {raw: string, headers: Record<string, string>}) => {
    return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers)
}

export const clerkCreateUser = inngest.createFunction(
    {
        id: 'clerk/create-db-user',
        name: 'Clerk - Create DB User',
    },
    { event: 'clerk/user.created' },
    async ({ event, step }) => {
        step.run("verify-webhook", async () => {
            try{
                await vertifyWebhook(event.data)
            } catch {
                throw new NonRetriableError('Invalid webhook')
            }
        })

        const userId = await step.run("create-db-user", async () => {
            const userData = event.data.data
            const email = userData.email_addresses.find((e) => e.id === userData.primary_email_address_id)
            if (email == null) {
                throw new NonRetriableError('No email found')
            }

            await insertUser({
                id: userData.id,
                email: email.email_address,
                name: `${userData.first_name} ${userData.last_name}`,
                imageUrl: userData.image_url,
                createdAt: new Date(userData.created_at),
                updatedAt: new Date(userData.updated_at),
            })
            return userData.id
        })

        await step.run("create-user-notifications-settings", async () => {
            await insertUserNotificationsSettings({ userId })
        })
    }
)