import { pgTable, unique, varchar, timestamp, index, foreignKey, uuid, text, integer, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"

export const jobListingApplicationsStage = pgEnum("job_listing_applications_stage", ['denied', 'applied', 'interested', 'interviewed', 'hired'])
export const jobListingsExperienceLevel = pgEnum("job_listings_experience_level", ['junior', 'mid-level', 'senior'])
export const jobListingsLocationRequirement = pgEnum("job_listings_location_requirement", ['remote', 'in-office', 'hybrid'])
export const jobListingsStatus = pgEnum("job_listings_status", ['draft', 'published', 'delisted'])
export const jobListingsType = pgEnum("job_listings_type", ['full-time', 'part-time', 'internship'])
export const jobListingsWageInterval = pgEnum("job_listings_wage_interval", ['hourly', 'yearly'])


export const organizations = pgTable("organizations", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	imageUrl: varchar(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("organizations_name_unique").on(table.name),
]);

export const jobListings = pgTable("job_listings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizationId: varchar().notNull(),
	title: varchar().notNull(),
	description: text().notNull(),
	wage: integer(),
	wageInterval: jobListingsWageInterval(),
	stateAbbreviation: varchar(),
	city: varchar(),
	isFeatured: boolean().default(false).notNull(),
	locationRequirment: jobListingsLocationRequirement().notNull(),
	experienceLevel: jobListingsExperienceLevel().notNull(),
	status: jobListingsStatus().default('draft').notNull(),
	type: jobListingsType().notNull(),
	postedAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index().using("btree", table.stateAbbreviation.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "job_listings_organizationId_organizations_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	email: varchar().notNull(),
	name: varchar().notNull(),
	imageUrl: varchar().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_name_unique").on(table.name),
]);

export const userNotificationSettings = pgTable("user_notification_settings", {
	userId: varchar().primaryKey().notNull(),
	newJobEmailNotifications: boolean().default(false).notNull(),
	aiPrompt: varchar(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_notification_settings_userId_users_id_fk"
		}),
]);

export const userResumes = pgTable("user_resumes", {
	userId: varchar().primaryKey().notNull(),
	resumeFileUrl: varchar().notNull(),
	resumeFileKey: varchar().notNull(),
	aiSummary: varchar(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_resumes_userId_users_id_fk"
		}),
]);

export const organizationUserSettings = pgTable("organization_user_settings", {
	organizationId: varchar().notNull(),
	userId: varchar().notNull(),
	newApplicationEmailNotifications: boolean().default(false).notNull(),
	minimumRating: integer(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organizations.id],
			name: "organization_user_settings_organizationId_organizations_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "organization_user_settings_userId_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.organizationId, table.userId], name: "organization_user_settings_userId_organizationId_pk"}),
]);

export const jobListingApplications = pgTable("job_listing_applications", {
	jobListingId: uuid().notNull(),
	userId: varchar().notNull(),
	coverLetter: text(),
	rating: integer(),
	stage: jobListingApplicationsStage().default('applied').notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.jobListingId],
			foreignColumns: [jobListings.id],
			name: "job_listing_applications_jobListingId_job_listings_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "job_listing_applications_userId_users_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.jobListingId, table.userId], name: "job_listing_applications_jobListingId_userId_pk"}),
]);
