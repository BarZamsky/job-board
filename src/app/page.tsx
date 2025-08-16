import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebarClient from './_AppSidebarClient'
import Link from 'next/link'
import { LogInIcon } from 'lucide-react'
import { SignedIn, SignedOut } from '@/services/clerk/components/SignInStatus'
import { SidebarUserButton } from '@/features/users/components/SidebarUserButton'

export default function HomePage() {
    return (
        <SidebarProvider className="overflow-y-hidden">
            <AppSidebarClient>
                <Sidebar collapsible="icon" className="overflow-y-hidden">
                    <SidebarHeader className="flex-row">
                        <SidebarTrigger />
                        <span className="text-xl text-nowrap">Jobs Portal</span>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarMenu>
                                <SignedOut>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/sign-in">
                                                <LogInIcon />
                                                <span>Log In</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SignedOut>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SignedIn>
                        <SidebarFooter>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton>
                                        <SidebarUserButton />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </SignedIn>
                </Sidebar>
                <main className="flex-1">
                    <h1>Hello</h1>
                </main>
            </AppSidebarClient>
        </SidebarProvider>
    )
}
