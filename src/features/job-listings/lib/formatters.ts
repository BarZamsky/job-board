import { ExperienceLevel, JobListingStatus, JobListingType, LocationRequirement, WageInterval } from '@/drizzle/schema'

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

export function formatJobListingStatus(status: JobListingStatus) {
    switch (status) {
        case 'draft':
            return 'Draft'
        case 'published':
            return 'Published'
        case 'delisted':
            return 'Delisted'
    }
}

export function formatWage(wageInterval: WageInterval, wage: number) {
    const wageFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    })
    switch (wageInterval) {
        case 'yearly':
            return wageFormatter.format(wage)
        case 'hourly':
            return `${wageFormatter.format(wage)} / hour`
    }
}

export function formatJobListingLocation(stateAbbreviation: string | null, city: string | null) {
    if (!stateAbbreviation && !city) {
        return 'None'
    }
    const location = []
    if (city) {
        location.push(city)
    }
    if (stateAbbreviation) {
        location.push(stateAbbreviation.toUpperCase())
    }
    return location.join(', ')
}
