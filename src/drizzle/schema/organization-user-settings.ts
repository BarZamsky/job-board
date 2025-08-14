import { boolean, integer, pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from '../schema-helpers';
import { UserTable } from './user';
import { OrganizationTable } from './organization';
import { relations } from 'drizzle-orm';

export const OrganizationUserSettingsTable = pgTable('organization_user_settings', {
    organizationId: varchar().references(() => OrganizationTable.id, { onDelete: 'cascade' }).notNull(),
    userId: varchar().references(() => UserTable.id, { onDelete: 'cascade' }).notNull(),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
},
(table) => [
    primaryKey({ columns: [table.userId, table.organizationId] }),
]);

export const organizationUserSettingsReferences = relations(OrganizationUserSettingsTable, ({ one }) => ({
    organization: one(OrganizationTable, {
        fields: [OrganizationUserSettingsTable.organizationId],
        references: [OrganizationTable.id],
    }),
    user: one(UserTable, {
        fields: [OrganizationUserSettingsTable.userId],
        references: [UserTable.id],
    }),
}));