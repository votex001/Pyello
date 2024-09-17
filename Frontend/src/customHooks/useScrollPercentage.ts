import { useState, useEffect, useCallback, RefObject } from "react"

function useScrollPercentage(
    ref: RefObject<HTMLElement>
): [number, (percentage: number) => void] {
    const [scrollPercentage, setScrollPercentage] = useState<number>(0)

    const updateScrollPercentage = useCallback(() => {
        const element = ref.current
        if (!element) return

        const { scrollTop, scrollHeight, clientHeight } = element
        const scrolled = scrollTop / (scrollHeight - clientHeight)
        setScrollPercentage(Math.round(scrolled * 100))
    }, [ref])

    const setScrollToPercentage = useCallback(
        (percentage: number) => {
            const element = ref.current
            if (!element) return

            const { scrollHeight, clientHeight } = element
            const scrollTop = ((scrollHeight - clientHeight) * percentage) / 100
            element.scrollTop = scrollTop
            setScrollPercentage(percentage)
        },
        [ref]
    )

    useEffect(() => {
        const element = ref.current
        if (element) {
            element.addEventListener("scroll", updateScrollPercentage)
            updateScrollPercentage() // Начальная проверка
        }

        return () => {
            if (element) {
                element.removeEventListener("scroll", updateScrollPercentage)
            }
        }
    }, [ref, updateScrollPercentage])

    return [scrollPercentage, setScrollToPercentage]
}

export default useScrollPercentage
