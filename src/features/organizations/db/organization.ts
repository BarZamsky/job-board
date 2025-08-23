import { db } from '@/drizzle/db'
import { OrganizationTable } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { revalidateOrgCache } from './cache/organizations'

export const insertOrganization = async (org: typeof OrganizationTable.$inferInsert) => {
    await db.insert(OrganizationTable).values(org).onConflictDoUpdate({
        target: OrganizationTable.id,
        set: org,
    })
    revalidateOrgCache(org.id)
}

export const updateOrganization = async (id: string, org: Partial<typeof OrganizationTable.$inferInsert>) => {
    await db.update(OrganizationTable).set(org).where(eq(OrganizationTable.id, id))
    revalidateOrgCache(id)
}

export const deleteOrganization = async (id: string) => {
    await db.delete(OrganizationTable).where(eq(OrganizationTable.id, id))
    revalidateOrgCache(id)
}
