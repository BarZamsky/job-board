'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function AppSidebarClient({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <div className="flex flex-col w-full">
                <div className="p-2 border-b flex items-center gap-1">
                    <SidebarTrigger />
                    <span className="text-xl">Jobs Portal</span>
                </div>
                <div className="flex-1">{children}</div>
            </div>
        )
    }

    return children
}
