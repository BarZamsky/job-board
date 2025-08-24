'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export function MarkdownPartial({
    dialogMarkdown,
    mainMarkdown,
    dialogTitle,
}: {
    dialogMarkdown: React.ReactNode
    mainMarkdown: React.ReactNode
    dialogTitle: string
}) {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const markdownRef = useRef<HTMLDivElement>(null)

    function handleOverflow(note: HTMLDivElement) {
        setIsOverflowing(note.scrollHeight > note.clientHeight)
    }

    useEffect(() => {
        const controller = new AbortController()
        window.addEventListener(
            'resize',
            () => {
                if (markdownRef.current) {
                    handleOverflow(markdownRef.current)
                }
            },
            { signal: controller.signal }
        )

        return () => controller.abort()
    }, [])

    useLayoutEffect(() => {
        if (markdownRef.current) {
            handleOverflow(markdownRef.current)
        }
    }, [])

    return (
        <>
            <div ref={markdownRef} className="max-h-[300px] overflow-hidden relative">
                {mainMarkdown}
                {isOverflowing && (
                    <div className="bg-gradient-to-t from-background to-transparent to-15% inset-0 absolute pointer-events-none" />
                )}
            </div>
            {isOverflowing && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="underline -ml-3">
                            Read More
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                        </DialogHeader>
                        <div className="overflow-y-auto flex-1">{dialogMarkdown}</div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}
