// Base export interface for all activity types
interface BaseActivity {
    id: string
    userFullName: string
    userId: string
    timeStamp: number
}

// Specific interfaces for each activity type
export interface MovedTaskActivity extends BaseActivity {
    type: "movedTask"
    targetId: string
    targetName: string
    from: string
    to: string
}

export interface TransferTaskActivity extends BaseActivity {
    type: "transferTask"
    targetId: string
    targetName: string
    boardId: string
    boardName: string
}

export interface ReceiveTaskActivity extends BaseActivity {
    type: "receiveTask"
    targetId: string
    targetName: string
    boardId: string
    boardName: string
}

export interface JoinTaskActivity extends BaseActivity {
    type: "joinTask"
    targetId: string
    targetName: string
}

export interface AddGroupActivity extends BaseActivity {
    type: "addGroup"
    targetName: string
}

export interface ArchiveGroupActivity extends BaseActivity {
    type: "archiveGroup"
    targetName: string
}

export interface AddTaskActivity extends BaseActivity {
    type: "addTask"
    targetId: string
    targetName: string
    groupName: string
}

export interface CreateBoardActivity extends BaseActivity {
    type: "createBoard"
}

export interface UnArchiveActivity extends BaseActivity {
    type: "unArchive"
    targetId: string
    targetName: string
}

export interface ArchiveTaskActivity extends BaseActivity {
    type: "archiveTask"
    targetId: string
    targetName: string
}

export interface DeleteTaskActivity extends BaseActivity {
    type: "deleteTask"
    targetName: string
    groupName: string
}

export interface AddCheckListActivity extends BaseActivity {
    type: "addCheckList"
    targetId: string
    targetName: string
    checklistName: string
}

export interface RemoveCheckListActivity extends BaseActivity {
    type: "removeCheckList"
    targetId: string
    targetName: string
    checklistName: string
}

export interface RenameCheckListActivity extends BaseActivity {
    type: "renameCheckList"
    targetId: string
    targetName: string
    checklistName: string
    previousName: string
}

export interface CheckedItemInCheckListActivity extends BaseActivity {
    type: "checkedItemInCheckList"
    targetId: string
    targetName: string
    itemName: string
}

export interface IncompleteItemInCheckListActivity extends BaseActivity {
    type: "incompleteItemInCheckList"
    targetId: string
    targetName: string
    itemName: string
}

export interface AddCommentActivity extends BaseActivity {
    type: "addComment"
    targetId: string
    targetName: string
    comment: string
}

export interface AddAttachmentActivity extends BaseActivity {
    type: "addAttachment"
    targetId: string
    targetName: string
    attachmentLink: string
    attachmentName: string
}

export interface RemoveAttachmentActivity extends BaseActivity {
    type: "removeAttachment"
    targetId: string
    targetName: string
    attachment: string
    attachmentName: string
}

export interface RenameBoardActivity extends BaseActivity {
    type: "renameBoard"
    previousName: string
}

export interface CloseBoardActivity extends BaseActivity {
    type: "closeBoard"
}

export interface ReopenBoardActivity extends BaseActivity {
    type: "reopenBoard"
}

export interface ChangeBackGroundActivity extends BaseActivity {
    type: "changeBackGround"
}

export interface ChangeVisibilityActivity extends BaseActivity {
    type: "changeVisibility"
    visibility: string
}

export interface AddDateActivity extends BaseActivity {
    type: "addDate"
    targetId: string
    targetName: string
    doDate: number
}

export interface RemoveDateActivity extends BaseActivity {
    type: "removeDate"
    targetId: string
    targetName: string
}

export interface CompleteDateActivity extends BaseActivity {
    type: "completeDate"
    targetId: string
    targetName: string
}

export interface IncompleteDateActivity extends BaseActivity {
    type: "incompleteDate"
    targetId: string
    targetName: string
}

// Union type for all activities
export type Activity =
    | MovedTaskActivity
    | TransferTaskActivity
    | ReceiveTaskActivity
    | JoinTaskActivity
    | AddGroupActivity
    | ArchiveGroupActivity
    | AddTaskActivity
    | CreateBoardActivity
    | UnArchiveActivity
    | ArchiveTaskActivity
    | DeleteTaskActivity
    | AddCheckListActivity
    | RemoveCheckListActivity
    | RenameCheckListActivity
    | CheckedItemInCheckListActivity
    | IncompleteItemInCheckListActivity
    | AddCommentActivity
    | AddAttachmentActivity
    | RemoveAttachmentActivity
    | RenameBoardActivity
    | CloseBoardActivity
    | ReopenBoardActivity
    | ChangeBackGroundActivity
    | ChangeVisibilityActivity
    | AddDateActivity
    | RemoveDateActivity
    | CompleteDateActivity
    | IncompleteDateActivity
