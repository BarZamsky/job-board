import { pgEnum, pgTable, text, varchar, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../schema-helpers'
import { OrganizationTable } from './organization'
import { relations } from 'drizzle-orm'
import { JobListingApplicationTable } from './job-listing-application'

export const wageIntervals = ['hourly', 'yearly'] as const
export type WageInterval = (typeof wageIntervals)[number]
export const wageIntervalsEnum = pgEnum('job_listings_wage_interval', wageIntervals)

export const locationRequirements = ['remote', 'in-office', 'hybrid'] as const
export type LocationRequirement = (typeof locationRequirements)[number]
export const locationRequirmentEnum = pgEnum('job_listings_location_requirement', locationRequirements)

export const experienceLevels = ['junior', 'mid-level', 'senior'] as const
export type ExperienceLevel = (typeof experienceLevels)[number]
export const experienceLevelEnum = pgEnum('job_listings_experience_level', experienceLevels)

export const jobListingStatuses = ['draft', 'published', 'delisted'] as const
export type JobListingStatus = (typeof jobListingStatuses)[number]
export const jobListingStatusEnum = pgEnum('job_listings_status', jobListingStatuses)

export const jobListingTypes = ['full-time', 'part-time', 'internship'] as const
export type JobListingType = (typeof jobListingTypes)[number]
export const jobListingTypeEnum = pgEnum('job_listings_type', jobListingTypes)

export const JobListingTable = pgTable(
    'job_listings',
    {
        id,
        organizationId: varchar()
            .references(() => OrganizationTable.id, { onDelete: 'cascade' })
            .notNull(),
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
    },
    (table) => [index().on(table.stateAbbreviation)]
)

export const jobListingReferences = relations(JobListingTable, ({ one, many }) => ({
    organization: one(OrganizationTable, {
        fields: [JobListingTable.organizationId],
        references: [OrganizationTable.id],
    }),
    applications: many(JobListingApplicationTable),
}))
