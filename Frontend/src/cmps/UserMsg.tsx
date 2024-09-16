import { eventBus } from "../services/event-bus.service"
import { useState, useEffect, useRef } from "react"

interface Msg {
    type: "success" | "info" | "error"
    txt: string
}

export function UserMsg() {
    const [msg, setMsg] = useState<Msg | null>(null)
    const timeoutIdRef = useRef<NodeJS.Timeout | null>()

    useEffect(() => {
        const unsubscribe = eventBus.on("show-msg", (newMsg) => {
            setMsg(newMsg)
            // window.scrollTo({ top: 0, behavior: 'smooth' })
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
                timeoutIdRef.current = null
            }
            if (newMsg.type === "success") {
                timeoutIdRef.current = setTimeout(closeMsg, 3000)
            }
        })

        // socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, (review) => {
        //   showSuccessMsg(`New review about me ${review.txt}`);
        // });

        return () => {
            unsubscribe()
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
                timeoutIdRef.current = null
            }
            // socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU);
        }
    }, [])

    function closeMsg() {
        setMsg(null)
    }

    if (!msg) return <span></span>
    return (
        <section className={`user-msg ${msg.type}`}>
            {msg.type === "info" && (
                <label className="pyello-icon icon-information user-msg-icon"></label>
            )}
            {msg.type === "success" && (
                <label className="pyello-icon icon-check-circle user-msg-icon"></label>
            )}
            {msg.txt}
            <button onClick={closeMsg} className="close-btn">
                <label className="pyello-icon icon-close"></label>
            </button>
        </section>
    )
}
