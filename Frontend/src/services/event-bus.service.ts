export const SHOW_MSG = "show-msg"

type EventListenersMap = {
    [key: string]: ((data: any) => void)[]
}

type MessageType = "success" | "error" | "info"

interface UserMessage {
    txt: string
    type: MessageType
}

function createEventEmitter() {
    const listenersMap: EventListenersMap = {}
    return {
        on(evName: string, listener: (data: any) => void) {
            listenersMap[evName] = listenersMap[evName]
                ? [...listenersMap[evName], listener]
                : [listener]
            return () => {
                listenersMap[evName] = listenersMap[evName].filter(
                    (func) => func !== listener
                )
            }
        },
        emit(evName: string, data: any) {
            if (!listenersMap[evName]) return
            listenersMap[evName].forEach((listener) => listener(data))
        },
    }
}

export const eventBus = createEventEmitter()

export function showUserMsg(msg: UserMessage) {
    eventBus.emit(SHOW_MSG, msg)
}

export function showSuccessMsg(txt: string) {
    showUserMsg({ txt, type: "success" })
}
export function showErrorMsg(txt: string) {
    showUserMsg({ txt, type: "error" })
}

export function showInfomationMsg(txt: string) {
    showUserMsg({ txt, type: "info" })
}
