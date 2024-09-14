export const SET_BOARDS = "SET_BOARDS"
export const EDIT_WORKSPACE = "EDIT_WORKSPACE"
export const ADD_BOARD = "ADD_BOARD"
export const VIEW_BOARD = "VIEW_BOARD"
export const REMOVE_BOARD = "REMOVE_BOARD"

const initialState = {
    boards: [],
}

export function workspaceReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break

        case EDIT_WORKSPACE:
            newState = {
                ...state,
                boards: state.boards.map((board) =>
                    board.id === action.board.id ? action.board : board
                ),
            }
            break

        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case REMOVE_BOARD:
            newState = {
                ...state,
                boards: state.boards.filter(
                    (board) => board.id !== action.boardId
                ),
            }
            break
        case VIEW_BOARD:
            newState = {
                ...state,
                boards: state.boards.map((board) =>
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
