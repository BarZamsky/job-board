import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarTrigger,
    Sidebar,
} from '../ui/sidebar'

import { SidebarProvider } from '../ui/sidebar'
import AppSidebarClient from './_AppSidebarClient'
import { SignedIn } from '@clerk/nextjs'
import { AppSidebarProps } from './types'

export const AppSidebar = ({ children, content, footerButton }: AppSidebarProps) => {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>
                <Sidebar collapsible="icon" className="overflow-y-hidden">
                    <SidebarHeader className="flex-row">
                        <SidebarTrigger />
                        <span className="text-xl text-nowrap">Jobs Portal</span>
                    </SidebarHeader>
                    <SidebarContent>{content}</SidebarContent>
                    <SignedIn>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </SignedIn>
                </Sidebar>
                <main className="flex-1">{children}</main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}
