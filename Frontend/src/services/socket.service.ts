import io, { Socket } from "socket.io-client"

const baseUrl = process.env.NODE_ENV === "production" ? "" : "//localhost:3030"
export const socketService = createSocketService()

socketService.setup()

function createSocketService() {
    let socket: Socket | null = null
    const socketService = {
        setup() {
            socket = io(baseUrl, {
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            })
        },

        on(eventName: string, cb: (data: any) => void) {
            if (socket) {
                socket.on(eventName, cb)
            }
        },

        off(eventName: string, cb?: (data: any) => void) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },

        emit(eventName: string, data: any) {
            if (!socket) {
                console.error(
                    "Socket is not initialized. Attempting to reconnect..."
                )
                this.setup()
                return
            }
            socket.emit(eventName, data)
        },

        subscribeToBoard(boardId: string) {
            if (!socket) {
                this.setup()
            } else {
                socket.emit("subscribe", boardId)
            }
        },

        unsubscribeFromBoard(boardId: string) {
            if (!socket) return
            socket.emit("unsubscribe", boardId)
        },

        subscribeToWorkspace() {
            if (!socket) {
                this.setup()
            } else {
                socket.emit("subscribe", "workspace")
            }
        },

        unsubscribeFromWorkspace() {
            if (!socket) return
            socket.emit("unsubscribe", "workspace")
        },

        terminate() {
            socket = null
        },
    }
    return socketService
}
