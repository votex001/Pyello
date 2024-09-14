// import { storageService } from "./async-storage.service";
import { Board } from "../models/board.models"
import { Task } from "../models/task&groups.models"
import { httpService } from "./http.service"
import { socketService } from "./socket.service"

export const boardService = {
    getById,
    save,
    remove,
    getByTaskId,
}

async function getByTaskId(taskId: string): Promise<Board> {
    try {
        //TODO filter boards by taskId in the server!!!!
        const boards = await httpService.get<Board[]>("boards")
        const board = boards?.find((board) =>
            board.groups?.some((group) =>
                group.tasks?.some((task: Task) => task.id === taskId)
            )
        )
        if (!board) {
            throw `Get failed, cannot find board with task id: ${taskId}`
        }
        return board
    } catch (err) {
        console.log(err)
        throw `Get failed, cannot find board by task id: ${err}`
    }
}

async function getById(boardId: string): Promise<Board> {
    try {
        const board = await httpService.get<Board>(`boards/${boardId}`)
        if (!board) {
            throw `Cannot found board with id ${boardId}`
        }
        return board
    } catch (error) {
        console.error("Error getting board by id", error)
        throw `Cannot found board with id ${boardId}`
    }
}

async function remove(boardId: string) {
    try {
        await httpService.delete(`boards/${boardId}`)
    } catch (err) {
        console.log(err)
    }
}

async function save(board: Board): Promise<Board> {
    try {
        const boardSize = new Blob([JSON.stringify(board)]).size
        if (boardSize > 200000) {
            throw new Error("Board size is too big, limit is 200kb")
        }
        let savedBoard: Board
        if (board.id) {
            savedBoard = await httpService.put<Board>("boards", board)
            socketService.emit("board-updated", { board })
        } else {
            savedBoard = await httpService.post<Board>("boards", board)
        }

        return savedBoard
    } catch (err) {
        console.log(err)
        throw err
    }
}
