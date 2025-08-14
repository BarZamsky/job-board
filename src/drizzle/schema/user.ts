import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from '../schema-helpers';
import { UserResumeTable } from './user-resume';
import { UserNotificationSettingsTable } from './user-notification-settings';
import { OrganizationUserSettingsTable } from './organization-user-settings';
import { relations } from 'drizzle-orm';

export const UserTable = pgTable('users', {
    id: varchar().primaryKey(),
    email: varchar().notNull(),
    name: varchar().notNull().unique(),
    imageUrl: varchar().notNull(),
    createdAt,
    updatedAt,
});

export const userReferences = relations(UserTable, ({ many, one }) => ({
    organizationUserSettings: many(OrganizationUserSettingsTable),
    notificationSettings: one(UserNotificationSettingsTable),
    resume: one(UserResumeTable),
}));