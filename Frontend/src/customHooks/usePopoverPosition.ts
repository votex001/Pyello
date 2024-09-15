import { useState, useEffect, useRef } from "react"

export function usePopoverPosition(anchorEl: HTMLElement | null, isOpen: boolean) {
    const popoverRef = useRef<HTMLDivElement | null>(null)
    const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({})
    const [initialPosition, setInitialPosition] = useState<React.CSSProperties | null>(null)

    useEffect(() => {
        if (isOpen && anchorEl && popoverRef.current) {
            const anchorRect = anchorEl.getBoundingClientRect()
            const initialPopoverStyle: React.CSSProperties = {
                top: anchorRect.bottom + window.scrollY,
                left: anchorRect.left + window.scrollX,
                position: "absolute",
            }

            setInitialPosition(initialPopoverStyle)
            setPopoverStyle(initialPopoverStyle)

            console.log(
                "1. x and y of popover anchor element:",
                anchorRect.x,
                anchorRect.y,
            )
            console.log("2. Height of anchor element:", anchorRect.height)
            console.log(
                "3. x and y of popover position:",
                anchorRect.left + window.scrollX,
                anchorRect.bottom + window.scrollY,
            )
        }
    }, [isOpen, anchorEl])

    useEffect(() => {
        const handleScroll = () => {
            if (popoverRef.current && initialPosition) {
                const popoverRect = popoverRef.current.getBoundingClientRect()
                const windowWidth = window.innerWidth
                const windowHeight = window.innerHeight
                const newPopoverStyle: React.CSSProperties = { ...initialPosition }

                // Adjust popover position if it exceeds viewport boundaries
                if (popoverRect.right > windowWidth) {
                    newPopoverStyle.left = windowWidth - popoverRect.width - 5 // 5px margin
                }
                if (popoverRect.bottom > windowHeight) {
                    newPopoverStyle.top = windowHeight - popoverRect.height - 5 // 5px margin
                }
                if (popoverRect.left < 0) {
                    newPopoverStyle.left = 5
                }
                if (popoverRect.top < 0) {
                    newPopoverStyle.top = 5
                }

                setPopoverStyle(newPopoverStyle)
            }
        }

        if (isOpen) {
            window.addEventListener("scroll", handleScroll)
            window.addEventListener("resize", handleScroll)
            return () => {
                window.removeEventListener("scroll", handleScroll)
                window.removeEventListener("resize", handleScroll)
            }
        }
    }, [isOpen, initialPosition])

    return { popoverRef, popoverStyle }
}
