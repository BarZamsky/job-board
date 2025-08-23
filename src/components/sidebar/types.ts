export type SidebarNavMenuItem = {
    href: string
    label: string
    icon: React.ReactNode
    authStatus?: 'signed-in' | 'signed-out'
}

export type SidebarNavMenuGroupProps = {
    items: SidebarNavMenuItem[]
    className?: string
}

export type AppSidebarProps = {
    children: React.ReactNode
    content: React.ReactNode
    footerButton: React.ReactNode
}
