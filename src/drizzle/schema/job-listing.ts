import { pgEnum, pgTable, text, varchar, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core';
import { createdAt, id, updatedAt } from '../schema-helpers';
import { OrganizationTable } from './organization';
import { relations } from 'drizzle-orm';
import { JobListingApplicationTable } from './job-listing-application';

const WageIntervals = ['hourly', 'yearly'] as const;
type WageInterval = typeof WageIntervals[number];
export const wageIntervalsEnum = pgEnum('job_listings_wage_interval', WageIntervals);

const LocationRequirements = ['remote', 'in-office', 'hybrid'] as const;
type LocationRequirement = typeof LocationRequirements[number];
export const locationRequirmentEnum = pgEnum('job_listings_location_requirement', LocationRequirements);

const ExperienceLevels = ['junior', 'mid-level', 'senior'] as const;
type ExperienceLevel = typeof ExperienceLevels[number];
export const experienceLevelEnum = pgEnum('job_listings_experience_level', ExperienceLevels);

const JobListingStatuses = ['draft', 'published', 'delisted'] as const;
type JobListingStatus = typeof JobListingStatuses[number];
export const jobListingStatusEnum = pgEnum('job_listings_status', JobListingStatuses);

const JobListingTypes = ['full-time', 'part-time', 'internship'] as const;
type JobListingType = typeof JobListingTypes[number];
export const jobListingTypeEnum = pgEnum('job_listings_type', JobListingTypes);

export const JobListingTable = pgTable('job_listings', {
    id,
    organizationId: varchar().references(() => OrganizationTable.id, { onDelete: 'cascade' }).notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalsEnum(),
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirment: locationRequirmentEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull().default('draft'),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
}, (table) => [index().on(table.stateAbbreviation)]);

export const jobListingReferences = relations(JobListingTable, ({ one, many }) => ({
    organization: one(OrganizationTable, {
        fields: [JobListingTable.organizationId],
        references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
}));