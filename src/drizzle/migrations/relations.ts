import { relations } from "drizzle-orm/relations";
import { organizations, jobListings, users, userNotificationSettings, userResumes, organizationUserSettings, jobListingApplications } from "./schema";

export const jobListingsRelations = relations(jobListings, ({one, many}) => ({
	organization: one(organizations, {
		fields: [jobListings.organizationId],
		references: [organizations.id]
	}),
	jobListingApplications: many(jobListingApplications),
}));

export const organizationsRelations = relations(organizations, ({many}) => ({
	jobListings: many(jobListings),
	organizationUserSettings: many(organizationUserSettings),
}));

export const userNotificationSettingsRelations = relations(userNotificationSettings, ({one}) => ({
	user: one(users, {
		fields: [userNotificationSettings.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userNotificationSettings: many(userNotificationSettings),
	userResumes: many(userResumes),
	organizationUserSettings: many(organizationUserSettings),
	jobListingApplications: many(jobListingApplications),
}));

export const userResumesRelations = relations(userResumes, ({one}) => ({
	user: one(users, {
		fields: [userResumes.userId],
		references: [users.id]
	}),
}));

export const organizationUserSettingsRelations = relations(organizationUserSettings, ({one}) => ({
	organization: one(organizations, {
		fields: [organizationUserSettings.organizationId],
		references: [organizations.id]
	}),
	user: one(users, {
		fields: [organizationUserSettings.userId],
		references: [users.id]
	}),
}));

export const jobListingApplicationsRelations = relations(jobListingApplications, ({one}) => ({
	jobListing: one(jobListings, {
		fields: [jobListingApplications.jobListingId],
		references: [jobListings.id]
	}),
	user: one(users, {
		fields: [jobListingApplications.userId],
		references: [users.id]
	}),
}));