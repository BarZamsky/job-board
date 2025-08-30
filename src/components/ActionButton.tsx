'use client'

import { toast } from 'sonner'
import { Button } from './ui/button'
import { ComponentPropsWithRef, useTransition } from 'react'
import { LoadingSwap } from './LoadingSwap'
import {
    AlertDialog,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from './ui/alert-dialog'

export function ActionButton({
    action,
    requireAreYouSure = false,
    areYouSureDescription = 'This action cannot be undone.',
    ...props
}: Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> & {
    action: () => Promise<{ error: boolean; message?: string }>
    requireAreYouSure?: boolean
    areYouSureDescription?: string
}) {
    const [isLoading, startTransition] = useTransition()

    function performAction() {
        startTransition(async () => {
            const { error, message } = await action()
            if (error) {
                toast.error(message ?? error)
            }
        })
    }

    if (requireAreYouSure) {
        return (
            <AlertDialog open={isLoading ? true : undefined}>
                <AlertDialogTrigger asChild>
                    <Button {...props} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>{areYouSureDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isLoading} onClick={performAction}>
                            <LoadingSwap isLoading={isLoading} className="inline-flex items-center gap-2">
                                Yes
                            </LoadingSwap>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Button variant="outline" {...props} onClick={performAction} disabled={isLoading}>
            <LoadingSwap isLoading={isLoading} className="inline-flex items-center gap-2">
                {props.children}
            </LoadingSwap>
        </Button>
    )
}
