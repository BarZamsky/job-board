import { Card, CardContent } from '@/components/ui/card'
import { JobListingForm } from '@/features/job-listings/components/JobListingForm'

export default function NewJobListingPage() {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">Create a new job listing</h1>
            <p className="text-muted-foreground mb-6">
                This does not post the listings yet, but it will allow you to create a draft.
            </p>
            <Card>
                <CardContent>
                    <JobListingForm />
                </CardContent>
            </Card>
        </div>
    )
}
