'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function AppSidebarClient({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <div className="flex flex-col w-full">
                <div className="flex flex-row">
                    <SidebarTrigger />
                    <span className="text-xl">WDS Jobs</span>
                </div>
                <div className="flex-1">{children}</div>
            </div>
        )
    }

    return children
}
