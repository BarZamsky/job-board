'use client'

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { SignedIn, SignedOut } from '@/services/clerk/components/SignInStatus'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarNavMenuGroupProps } from './types'

export function SidebarNavMenuGroup({ items, className }: SidebarNavMenuGroupProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup className={className}>
            <SidebarMenu>
                {items.map((item) => {
                    const navItem = (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={pathname === item.href}>
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                    if (item.authStatus === 'signed-out') {
                        return <SignedOut key={item.href}>{navItem}</SignedOut>
                    } else if (item.authStatus === 'signed-in') {
                        return <SignedIn key={item.href}>{navItem}</SignedIn>
                    }
                    return navItem
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
