import {
    BoardAction,
    BoardActionsTypes,
    BoardState,
} from "../interface/board.store"

export const SET_BOARD = "SET_BOARD"
export const EDIT_LABEL = "EDIT_LABEL"
export const VIEW_BOARD = "VIEW_BOARD"

export const SET_IS_EXPANDED = "SET_IS_EXPANDED"

export const EDIT_TASK = "EDIT_TASK"
export const ADD_LABEL = "ADD_LABEL"
export const DELETE_LABEL = "DELETE_LABEL"

export const ADD_GROUP = "ADD_GROUP"
export const EDIT_GROUP = "EDIT_GROUP"
export const COPY_GROUP = "COPY_GROUP"
export const MOVE_ALL_CARDS = "MOVE_ALL_CARDS"
export const ARCHIVE_ALL_CARDS = "ARCHIVE_ALL_CARDS"

const initialState: BoardState = {
    board: null,
    isExpanded: true,
}

export function boardReducer(state = initialState, action = {} as BoardAction) {
    var newState = state
    switch (action.type) {
        case BoardActionsTypes.SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case BoardActionsTypes.SET_IS_EXPANDED:
            newState = { ...state, isExpanded: action.isExpanded }
            break

        case BoardActionsTypes.ADD_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: [...state.board!.groups, action.group],
                    updatedAt: new Date().getTime(),
                    activities: action.activity
                        ? [...state.board!.activities, action.activity]
                        : state.board!.activities || [],
                },
            }
            break

        case BoardActionsTypes.EDIT_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: state.board!.groups.map((group) =>
                        group.id === action.group.id ? action.group : group
                    ),
                    updatedAt: new Date().getTime(),
                },
            }
            break

        case BoardActionsTypes.COPY_GROUP:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: action.groups,
                    updatedAt: new Date().getTime(),
                },
            }
            break

        case BoardActionsTypes.MOVE_ALL_CARDS:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: state.board!.groups.map((g) => {
                        if (g.id === action.sourceGroup.id) {
                            return { ...g, tasks: action.sourceGroup.tasks }
                        }
                        if (g.id === action.targetGroup.id) {
                            return {
                                ...g,
                                tasks: [...action.targetGroup.tasks],
                            }
                        }
                        return g
                    }),
                    updatedAt: new Date().getTime(),
                },
            }
            break

        case BoardActionsTypes.ARCHIVE_ALL_CARDS:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: state.board!.groups.map((g) =>
                        g.id === action.group.id ? action.group : g
                    ),
                    updatedAt: new Date().getTime(),
                },
            }
            break

        case BoardActionsTypes.EDIT_TASK:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    groups: state.board!.groups.map((group) =>
                        group.id === action.task.idGroup
                            ? {
                                  ...group,
                                  tasks: group.tasks.map((t) =>
                                      t.id === action.task.id ? action.task : t
                                  ),
                                  updatedAt: new Date().toISOString(),
                              }
                            : group
                    ),
                    updatedAt: new Date().getTime(),
                    activities: action.activity
                        ? [...state.board!.activities, action.activity]
                        : state.board!.activities || [],
                },
            }
            break

        case BoardActionsTypes.EDIT_LABEL:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    labels: state.board!.labels.map((l) =>
                        l.id === action.label.id ? action.label : l
                    ),
                    updatedAt: new Date().getTime(),
                },
            }
            break

        case BoardActionsTypes.ADD_LABEL:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    labels: [...state.board!.labels, action.label],
                },
            }
            break

        case BoardActionsTypes.VIEW_BOARD:
            newState = {
                ...state,
                board: { ...state.board!, viewedAt: Date.now() },
            }
            break

        case BoardActionsTypes.DELETE_LABEL:
            newState = {
                ...state,
                board: {
                    ...state.board!,
                    labels: state.board!.labels.filter(
                        (l) => l.id !== action.labelId
                    ),
                    groups: state.board!.groups.map((g) => ({
                        ...g,
                        tasks: g.tasks.map((t) => ({
                            ...t,
                            idLabels: t.idLabels.filter(
                                (id) => id !== action.labelId
                            ),
                        })),
                    })),
                    updatedAt: new Date().getTime(),
                },
            }
            break

        default:
            return state
    }
    return newState
}
