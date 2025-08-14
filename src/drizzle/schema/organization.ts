import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from '../schema-helpers';
import { JobListingTable } from './job-listing';
import { relations } from 'drizzle-orm';
import { OrganizationUserSettingsTable } from './organization-user-settings';

export const OrganizationTable = pgTable('organizations', {
    id: varchar().primaryKey(),
    name: varchar().notNull().unique(),
    imageUrl: varchar(),
    createdAt,
    updatedAt,
});

export const organizationReferences = relations(OrganizationTable, ({ many }) => ({
    jobListings: many(JobListingTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
}));