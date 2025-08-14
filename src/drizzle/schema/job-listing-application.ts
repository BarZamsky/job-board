import { integer, pgEnum, pgTable, primaryKey, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createdAt, updatedAt } from '../schema-helpers';
import { JobListingTable } from './job-listing';
import { UserTable } from './user';
import { relations } from 'drizzle-orm';

const ApplicationStages = ['denied', 'applied', 'interested', 'interviewed', 'hired'] as const;
type ApplicationStage = typeof ApplicationStages[number];
export const applicationStageEnum = pgEnum('job_listing_applications_stage', ApplicationStages);

export const JobListingApplicationTable = pgTable('job_listing_applications', {
    jobListingId: uuid().references(() => JobListingTable.id, { onDelete: 'cascade' }).notNull(),
    userId: varchar().references(() => UserTable.id, { onDelete: 'cascade' }).notNull(),
    coverLetter: text(),
    rating: integer(),
    stage: applicationStageEnum().notNull().default('applied'),
    createdAt,
    updatedAt,
},
(table) => [
    primaryKey({ columns: [table.jobListingId, table.userId] }),
]);

export const jobListingApplicationReferences = relations(JobListingApplicationTable, ({ one }) => ({
    jobListing: one(JobListingTable, {
        fields: [JobListingApplicationTable.jobListingId],
        references: [JobListingTable.id],
    }),
    user: one(UserTable, {
        fields: [JobListingApplicationTable.userId],
        references: [UserTable.id],
    }),
}));