import { Activity } from "../../models/activities.models"
import { Board, Label } from "../../models/board.models"
import { Group, Task } from "../../models/task&groups.models"

export interface BoardState {
    board: Board | null
    isExpanded: boolean
}

export enum BoardActionsTypes {
    SET_BOARD = "SET_BOARD",
    EDIT_LABEL = "EDIT_LABEL",
    VIEW_BOARD = "VIEW_BOARD",
    SET_IS_EXPANDED = "SET_IS_EXPANDED",
    EDIT_TASK = "EDIT_TASK",
    ADD_LABEL = "ADD_LABEL",
    DELETE_LABEL = "DELETE_LABEL",
    ADD_GROUP = "ADD_GROUP",
    EDIT_GROUP = "EDIT_GROUP",
    COPY_GROUP = "COPY_GROUP",
    MOVE_ALL_CARDS = "MOVE_ALL_CARDS",
    ARCHIVE_ALL_CARDS = "ARCHIVE_ALL_CARDS",
}
interface SetBoardAction {
    type: BoardActionsTypes.SET_BOARD
    board: Board
}
interface SetIsExpandedAction {
    type: BoardActionsTypes.SET_IS_EXPANDED
    isExpanded: boolean
}

interface AddGroupAction {
    type: BoardActionsTypes.ADD_GROUP
    group: Group // Assume Group is a defined type
    activity?: Activity
}
interface EditGroupAction {
    type: BoardActionsTypes.EDIT_GROUP
    group: Group
}
interface CopyGroupAction {
    type: BoardActionsTypes.COPY_GROUP
    groups: Group[]
}
interface MoveAllCardsAction {
    type: BoardActionsTypes.MOVE_ALL_CARDS
    sourceGroup: Group
    targetGroup: Group
}
interface ArchiveAllCardsAction {
    type: BoardActionsTypes.ARCHIVE_ALL_CARDS
    group: Group
}
interface EditTaskAction {
    type: BoardActionsTypes.EDIT_TASK
    task: Task
    activity?: Activity
}
interface EditLabelAction {
    type: BoardActionsTypes.EDIT_LABEL
    label: Label
}
interface AddLabelAction {
    type: BoardActionsTypes.ADD_LABEL
    label: Label
}
interface ViewBoardAction {
    type: BoardActionsTypes.VIEW_BOARD
}
interface DeleteLabelAction {
    type: BoardActionsTypes.DELETE_LABEL
    labelId: string
}
export type BoardAction =
    | SetBoardAction
    | SetIsExpandedAction
    | AddGroupAction
    | EditGroupAction
    | CopyGroupAction
    | MoveAllCardsAction
    | ArchiveAllCardsAction
    | EditTaskAction
    | EditLabelAction
    | AddLabelAction
    | ViewBoardAction
    | DeleteLabelAction
