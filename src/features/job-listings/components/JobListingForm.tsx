'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jobListingSchema } from '../actions/schemas'
import { JobListingFormValues } from '../actions/schemas'
import { FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormLabel } from '@/components/ui/form'
import { FormField } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    experienceLevels,
    JobListingTable,
    jobListingTypes,
    locationRequirements,
    wageIntervals,
} from '@/drizzle/schema'
import {
    formatExperienceLevel,
    formatJobListingType,
    formatLocationRequirement,
    formatWageInterval,
} from '../lib/formatters'
import { states } from '@/data/states'
import { MarkdownEditor } from '@/components/markdown/MarkdownEditer'
import { Button } from '@/components/ui/button'
import { LoadingSwap } from '@/components/LoadingSwap'
import { createJobListing, updateJobListing } from '../actions/actions'
import { toast } from 'sonner'

const NONE_SELECT_VALUE = 'none'
export function JobListingForm({
    jobListing,
}: {
    jobListing: Pick<
        typeof JobListingTable.$inferSelect,
        | 'id'
        | 'title'
        | 'description'
        | 'experienceLevel'
        | 'locationRequirment'
        | 'type'
        | 'wage'
        | 'wageInterval'
        | 'stateAbbreviation'
        | 'city'
    >
}) {
    const form = useForm<JobListingFormValues>({
        resolver: zodResolver(jobListingSchema),
        defaultValues: jobListing ?? {
            title: '',
            description: '',
            experienceLevel: 'junior',
            locationRequirment: 'in-office',
            type: 'full-time',
            wage: null,
            wageInterval: 'yearly',
            stateAbbreviation: null,
            city: null,
        },
    })

    const onSubmit = async (data: JobListingFormValues) => {
        const action = jobListing ? updateJobListing.bind(null, jobListing.id) : createJobListing
        const result = await action(data)
        if (result.error) {
            toast.error(result.message)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 @container">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 @md:grid-cols-2 items-start">
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="wage"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Wage</FormLabel>
                                <div className="flex">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ''}
                                            className="rounded-r-none"
                                            onChange={(e) =>
                                                field.onChange(
                                                    isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormField
                                        name="wageInterval"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select
                                                    value={field.value ?? ''}
                                                    onValueChange={(value) => field.onChange(value ?? null)}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-l-none">
                                                            / <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {wageIntervals.map((interval) => (
                                                            <SelectItem key={interval} value={interval}>
                                                                {formatWageInterval(interval)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormDescription>Optional</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 @md:grid-cols-2 items-start">
                    <div className="grid grid-cols-1 gap-x-2 gap-y-6 @xs:grid-cols-2 items-start">
                        <FormField
                            name="city"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value ?? ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="stateAbbreviation"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <Select
                                        value={field.value ?? ''}
                                        onValueChange={(val) => field.onChange(val === NONE_SELECT_VALUE ? null : val)}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {field.value !== null && (
                                                <SelectItem value={NONE_SELECT_VALUE} className="text-muted-foreground">
                                                    Clear
                                                </SelectItem>
                                            )}

                                            {Object.entries(states).map(([abbreviation, name]) => (
                                                <SelectItem key={abbreviation} value={abbreviation}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="locationRequirment"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location Requirement</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locationRequirements.map((requirement) => (
                                            <SelectItem key={requirement} value={requirement}>
                                                {formatLocationRequirement(requirement)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 @md:grid-cols-2 items-start">
                    <FormField
                        name="type"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Type</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {jobListingTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {formatJobListingType(type)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="experienceLevel"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Experience Level</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {experienceLevels.map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {formatExperienceLevel(level)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <MarkdownEditor {...field} markdown={field.value} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                    <LoadingSwap isLoading={form.formState.isSubmitting}>Create Job Listing</LoadingSwap>
                </Button>
            </form>
        </Form>
    )
}
