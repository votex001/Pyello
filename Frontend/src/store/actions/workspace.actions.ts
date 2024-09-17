import { boardService } from "../../services/board.service"
import { utilService } from "../../services/util.service"
import { workspaceService } from "../../services/workspace.service"
import { store } from "../store"
import { WorkspaceActionTypes } from "../interface/workspace.store"
import { Board } from "../../models/board.models"
import { User } from "../../models/user.model"
import {
    ReceiveTaskActivity,
    TransferTaskActivity,
} from "../../models/activities.models"
import { BoardActionsTypes } from "../interface/board.store"

export async function setBoards() {
    const boards = await workspaceService.getAllBoards()
    store.dispatch({ type: WorkspaceActionTypes.SET_BOARDS, boards })
}

export async function updateWorkspaceBoard(boardId: string) {
    const board = await boardService.getById(boardId)

    if (board.id === store.getState().boardModule.board?.id) {
        store.dispatch({ type: BoardActionsTypes.SET_BOARD, board: board })
    }

    if (
        !store.getState().workspaceModule.boards?.find((b) => b.id === board.id)
    ) {
        store.dispatch({ type: WorkspaceActionTypes.ADD_BOARD, board: board })
    } else {
        store.dispatch({
            type: WorkspaceActionTypes.EDIT_WORKSPACE,
            board: board,
        })
    }
}

export async function viewWorkspaceBoard(boardId: string) {
    const boards = await workspaceService.getAllBoards()
    const board = boards.find((b) => b.id === boardId)
    if (!board) return
    store.dispatch({
        type: WorkspaceActionTypes.VIEW_BOARD,
        boardId: board.id!,
    })
}

export async function editWorkspaceBoard(board: Board) {
    store.dispatch({ type: WorkspaceActionTypes.EDIT_WORKSPACE, board: board })
    await boardService.save(board)
}
interface MoveTaskEvent {
    taskId?: string
    sourceBoardId?: string
    sourceGroupId?: string
    destinationBoardId?: string
    destinationGroupId?: string
    destinationIndex?: number
    user?: User
}
export async function moveTaskBetweenBoards(moveTaskEvent: MoveTaskEvent) {
    const {
        taskId,
        sourceBoardId,
        sourceGroupId,
        destinationBoardId,
        destinationGroupId,
        destinationIndex,
        user,
    } = moveTaskEvent
    if (
        !taskId ||
        !sourceBoardId ||
        !sourceGroupId ||
        !destinationBoardId ||
        !destinationGroupId ||
        !destinationIndex ||
        !user
    )
        return

    const boards = await workspaceService.getAllBoards()
    if (!boards) return
    const sourceBoard = boards.find((b) => b.id === sourceBoardId)
    const destinationBoard = boards.find((b) => b.id === destinationBoardId)
    if (!sourceBoard || !destinationBoard) return
    const task = sourceBoard.groups
        .find((g) => g.id === sourceGroupId)
        ?.tasks.find((t) => t.id === taskId)

    if (!task) {
        console.error(`Task ${taskId} not found in group ${sourceGroupId}`)
        return
    }

    const newTask = {
        ...task,
        idBoard: destinationBoardId,
        idGroup: destinationGroupId,
        pos: destinationIndex,
    }

    //Remove task from source board
    const updatedSourceBoard = {
        ...sourceBoard,
        groups: sourceBoard.groups.map((g) => {
            if (g.id === sourceGroupId) {
                return {
                    ...g,
                    tasks: g.tasks
                        .filter((t) => t.id !== taskId)
                        .map((t) =>
                            t.pos > task.pos ? { ...t, pos: t.pos - 1 } : t
                        ),
                }
            }
            return g
        }),
    }

    const sourceActivity = utilService.createActivity(
        {
            type: "transferTask",
            targetId: task.id,
            targetName: task.name,
            boardId: destinationBoard.id!,
            boardName: destinationBoard.name,
        },
        user
    ) as TransferTaskActivity
    updatedSourceBoard.activities.push(sourceActivity)
    store.dispatch({
        type: BoardActionsTypes.SET_BOARD,
        board: updatedSourceBoard,
    })
    store.dispatch({
        type: WorkspaceActionTypes.EDIT_WORKSPACE,
        board: updatedSourceBoard,
    })
    await boardService.save(updatedSourceBoard)

    //Add task to destination board
    const updatedDestinationBoard = {
        ...destinationBoard,
        groups: destinationBoard.groups.map((g) => {
            if (g.id === destinationGroupId) {
                const newGroup = {
                    ...g,
                    tasks: g.tasks.map((t) =>
                        t.pos >= destinationIndex ? { ...t, pos: t.pos + 1 } : t
                    ),
                }
                newGroup.tasks.splice(destinationIndex, 0, newTask)
                return newGroup
            }
            return g
        }),
    }
    const destinationActivity = utilService.createActivity(
        {
            type: "receiveTask",
            targetId: task.id,
            targetName: task.name,
            boardId: sourceBoard.id!,
            boardName: sourceBoard.name,
        },
        user
    ) as ReceiveTaskActivity
    updatedDestinationBoard.activities.push(destinationActivity)
    store.dispatch({
        type: WorkspaceActionTypes.EDIT_WORKSPACE,
        board: updatedDestinationBoard,
    })
    await boardService.save(updatedDestinationBoard)
}

export async function createBoard(board: Board) {
    const newBoard = await boardService.save({
        ...board,
        updatedAt: Date.now(),
    })
    store.dispatch({ type: WorkspaceActionTypes.ADD_BOARD, board: newBoard })
    return newBoard.id
}
