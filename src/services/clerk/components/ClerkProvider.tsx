'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useIsDarkMode } from './useIdDarkMode'
import { Suspense } from 'react'

export default function ClerkProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useIsDarkMode()
    return (
        <Suspense>
            <ClerkProviderBase appearance={isDarkMode ? { baseTheme: [dark] } : {}}>{children}</ClerkProviderBase>
        </Suspense>
    )
}
