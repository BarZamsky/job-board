import { Badge } from '@/components/ui/badge'
import { JobListingTable } from '@/drizzle/schema'
import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'
import {
    formatExperienceLevel,
    formatJobListingLocation,
    formatJobListingType,
    formatLocationRequirement,
    formatWage,
} from '../lib/formatters'
import { BanknoteIcon, BuildingIcon, GraduationCapIcon, HourglassIcon, MapIcon, StarIcon } from 'lucide-react'

export function JobListingBadges({
    jobListing: { isFeatured, wageInterval, wage, experienceLevel, locationRequirment, type, stateAbbreviation, city },
    className,
}: {
    jobListing: Pick<
        typeof JobListingTable.$inferSelect,
        | 'wage'
        | 'wageInterval'
        | 'experienceLevel'
        | 'locationRequirment'
        | 'type'
        | 'isFeatured'
        | 'stateAbbreviation'
        | 'city'
    >
    className?: string
}) {
    const badgeProps = {
        variant: 'outline',
        className: cn(isFeatured && 'bg-primary/35'),
    } satisfies ComponentProps<typeof Badge>

    return (
        <>
            {isFeatured && (
                <Badge
                    {...badgeProps}
                    className={cn(className, 'border-featured bg-featured/50 text-featured-foreground')}
                >
                    <StarIcon />
                    Featured
                </Badge>
            )}
            {wage !== null && wageInterval !== null && (
                <Badge {...badgeProps}>
                    <BanknoteIcon />
                    {formatWage(wageInterval, wage)}
                </Badge>
            )}
            {(stateAbbreviation !== null || city !== null) && (
                <Badge {...badgeProps}>
                    <MapIcon className="size-10" />
                    {formatJobListingLocation(stateAbbreviation, city)}
                </Badge>
            )}
            <Badge {...badgeProps}>
                <BuildingIcon />
                {formatLocationRequirement(locationRequirment)}
            </Badge>
            <Badge {...badgeProps}>
                <HourglassIcon />
                {formatJobListingType(type)}
            </Badge>
            <Badge {...badgeProps}>
                <GraduationCapIcon />
                {formatExperienceLevel(experienceLevel)}
            </Badge>
        </>
    )
}
