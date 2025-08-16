'use client'

import { ClerkProvider as ClerkProviderBase } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useIsDarkMode } from '@/hooks/useIdDarkMode'

export default function ClerkProvider({ children }: { children: React.ReactNode }) {
    const isDarkMode = useIsDarkMode()
    return <ClerkProviderBase appearance={isDarkMode ? { baseTheme: [dark] } : undefined}>{children}</ClerkProviderBase>
}
