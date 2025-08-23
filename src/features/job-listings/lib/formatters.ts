import { ExperienceLevel, JobListingType, LocationRequirement, WageInterval } from '@/drizzle/schema'

export function formatWageInterval(interval: WageInterval) {
    switch (interval) {
        case 'yearly':
            return 'Year'
        case 'hourly':
            return 'Hour'
    }
}

export function formatLocationRequirement(requirement: LocationRequirement) {
    switch (requirement) {
        case 'remote':
            return 'Remote'
        case 'in-office':
            return 'In-Office'
        case 'hybrid':
            return 'Hybrid'
    }
}

export function formatJobListingType(type: JobListingType) {
    switch (type) {
        case 'full-time':
            return 'Full-Time'
        case 'part-time':
            return 'Part-Time'
    }
}

export function formatExperienceLevel(level: ExperienceLevel) {
    switch (level) {
        case 'junior':
            return 'Junior'
        case 'mid-level':
            return 'Mid-Level'
        case 'senior':
            return 'Senior'
    }
}
