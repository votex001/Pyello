import { WorkspaceAction, WorkspaceActionTypes, WorkspaceState } from "../interface/workspace.store"

export const SET_BOARDS = "SET_BOARDS"
export const EDIT_WORKSPACE = "EDIT_WORKSPACE"
export const ADD_BOARD = "ADD_BOARD"
export const VIEW_BOARD = "VIEW_BOARD"
export const REMOVE_BOARD = "REMOVE_BOARD"

const initialState: WorkspaceState = {
    boards: null,
}

export function workspaceReducer(
    state = initialState,
    action = {} as WorkspaceAction
) {
    var newState = state
    switch (action.type) {
        case WorkspaceActionTypes.SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break

        case WorkspaceActionTypes.EDIT_WORKSPACE:
            newState = {
                ...state,
                boards: state.boards!.map((board) =>
                    board.id === action.board.id ? action.board : board
                ),
            }
            break

        case WorkspaceActionTypes.ADD_BOARD:
            newState = { ...state, boards: [...state.boards!, action.board] }
            break
        case WorkspaceActionTypes.REMOVE_BOARD:
            newState = {
                ...state,
                boards: state.boards!.filter(
                    (board) => board.id !== action.boardId
                ),
            }
            break
        case WorkspaceActionTypes.VIEW_BOARD:
            newState = {
                ...state,
                boards: state.boards!.map((board) =>
                    board.id === action.boardId
                        ? { ...board, viewedAt: Date.now() }
                        : board
                ),
            }
            break

        default:
            return state
    }
    return newState
}
