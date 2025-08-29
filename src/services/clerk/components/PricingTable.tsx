import { PricingTable as ClerckPricingTable } from '@clerk/nextjs'

export function PricingTable() {
    return <ClerckPricingTable forOrganizations newSubscriptionRedirectUrl="/employer/pricing" />
}
