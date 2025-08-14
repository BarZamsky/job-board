import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebarClient from './_AppSidebarClient'

export default function HomePage() {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>
                <Sidebar collapsible="icon" className="overflow-y-hidden">
                    <SidebarHeader className="flex-row">
                        <SidebarTrigger />
                        <span className="text-xl text-nowrap">WDS Jobs</span>
                    </SidebarHeader>
                    <SidebarContent>jjfjffj</SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>jfjjfj</SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <main className="flex-1">
                    <h1>Hello</h1>
                </main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}
