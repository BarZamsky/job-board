import { useEffect, useState } from "react"

export function useIsDarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window === 'undefined') {
            return false
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        const controller = new AbortController()
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            setDarkMode(e.matches)
        }, {signal: controller.signal})

        return () => {
            controller.abort()
        }
    }, [])

    return darkMode
}