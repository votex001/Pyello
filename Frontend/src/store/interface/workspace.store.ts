import { Board } from "../../models/board.models"

export interface WorkspaceState {
    boards: Board[] | null
}

export enum WorkspaceActionTypes {
    SET_BOARDS = "SET_BOARDS",
    EDIT_WORKSPACE = "EDIT_WORKSPACE",
    ADD_BOARD = "ADD_BOARD",
    VIEW_BOARD = "VIEW_BOARD",
    REMOVE_BOARD = "REMOVE_BOARD",
}

interface SetBoardsAction {
    type: WorkspaceActionTypes.SET_BOARDS
    boards: Board[]
}

interface EditWorkspaceAction {
    type: WorkspaceActionTypes.EDIT_WORKSPACE
    boards: Board[]
}

interface AddBoardAction {
    type: WorkspaceActionTypes.ADD_BOARD
    board: Board
}

interface ViewBoardAction {
    type: WorkspaceActionTypes.VIEW_BOARD
    boardId: string
}

interface RemoveBoardAction {
    type: WorkspaceActionTypes.REMOVE_BOARD
    boardId: string
}

export type WorkspaceAction =
    | SetBoardsAction
    | EditWorkspaceAction
    | AddBoardAction
    | ViewBoardAction
    | RemoveBoardAction
