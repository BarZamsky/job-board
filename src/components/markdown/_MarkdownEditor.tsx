'use client'

import { useIsDarkMode } from '@/hooks/useIdDarkMode'
import { cn } from '@/lib/utils'
import {
    MDXEditorProps,
    MDXEditorMethods,
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    toolbarPlugin,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    ListsToggle,
    InsertThematicBreak,
    InsertTable,
} from '@mdxeditor/editor'
import { Ref } from 'react'

export const markdownClassNames = 'max-w-none prose prose-neutral dark:prose-invert font-sans'

export default function InternalMarkdownEditor({
    ref,
    className,
    ...props
}: MDXEditorProps & { ref: Ref<MDXEditorMethods> }) {
    const isDarkMode = useIsDarkMode()
    return (
        <MDXEditor
            ref={ref}
            {...props}
            className={cn(markdownClassNames, isDarkMode && 'dark-theme', className)}
            suppressHtmlProcessing
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                thematicBreakPlugin(),
                quotePlugin(),
                markdownShortcutPlugin(),
                tablePlugin(),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <BlockTypeSelect />
                            <BoldItalicUnderlineToggles />
                            <ListsToggle />
                            <InsertThematicBreak />
                            <InsertTable />
                        </>
                    ),
                }),
            ]}
        />
    )
}
