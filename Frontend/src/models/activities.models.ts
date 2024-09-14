// Base interface for all activity types
interface BaseActivity {
    id: string
    userFullName: string
    userId: string
    timeStamp: number
}

// Specific interfaces for each activity type
interface MovedTaskActivity extends BaseActivity {
    type: "movedTask(inBoard)"
    targetId: string
    targetName: string
    from: string
    to: string
}

interface TransferTaskActivity extends BaseActivity {
    type: "transferTask(betweenBoards(to))"
    targetId: string
    targetName: string
    boardId: string
    boardName: string
}

interface ReceiveTaskActivity extends BaseActivity {
    type: "receiveTask(betweenBoards(from))"
    targetId: string
    targetName: string
    boardId: string
    boardName: string
}

interface JoinTaskActivity extends BaseActivity {
    type: "joinTask"
    targetId: string
    targetName: string
}

interface AddGroupActivity extends BaseActivity {
    type: "addGroup"
    targetName: string
}

interface ArchiveGroupActivity extends BaseActivity {
    type: "archiveGroup"
    targetName: string
}

interface AddTaskActivity extends BaseActivity {
    type: "addTask"
    targetId: string
    targetName: string
    groupName: string
}

interface CreateBoardActivity extends BaseActivity {
    type: "createBoard"
}

interface UnArchiveActivity extends BaseActivity {
    type: "unArchive"
    targetId: string
    targetName: string
}

interface ArchiveTaskActivity extends BaseActivity {
    type: "archiveTask"
    targetId: string
    targetName: string
}

interface DeleteTaskActivity extends BaseActivity {
    type: "deleteTask"
    targetName: string
    groupName: string
}

interface AddCheckListActivity extends BaseActivity {
    type: "addCheckList"
    targetId: string
    targetName: string
    checklistName: string
}

interface RemoveCheckListActivity extends BaseActivity {
    type: "removeCheckList"
    targetId: string
    targetName: string
    checklistName: string
}

interface RenameCheckListActivity extends BaseActivity {
    type: "renameCheckList(onlyForTask)"
    targetId: string
    targetName: string
    checklistName: string
    previousName: string
}

interface CheckedItemInCheckListActivity extends BaseActivity {
    type: "checkedItemInCheckList"
    targetId: string
    targetName: string
    itemName: string
}

interface IncompleteItemInCheckListActivity extends BaseActivity {
    type: "incompleteItemInCheckList"
    targetId: string
    targetName: string
    itemName: string
}

interface AddCommentActivity extends BaseActivity {
    type: "addComment"
    targetId: string
    targetName: string
    comment: string
}

interface AddAttachmentActivity extends BaseActivity {
    type: "addAttachment"
    targetId: string
    targetName: string
    attachmentLink: string
    attachmentName: string
}

interface RemoveAttachmentActivity extends BaseActivity {
    type: "removeAttachment"
    targetId: string
    targetName: string
    attachment: string
    attachmentName: string
}

interface RenameBoardActivity extends BaseActivity {
    type: "renameBoard"
    previousName: string
}

interface CloseBoardActivity extends BaseActivity {
    type: "closeBoard"
}

interface ReopenBoardActivity extends BaseActivity {
    type: "reopenBoard"
}

interface ChangeBackGroundActivity extends BaseActivity {
    type: "changeBackGround"
}

interface ChangeVisibilityActivity extends BaseActivity {
    type: "changeVisibility"
    visibility: string
}

interface AddDateActivity extends BaseActivity {
    type: "addDate"
    targetId: string
    targetName: string
    doDate: number
}

interface RemoveDateActivity extends BaseActivity {
    type: "removeDate"
    targetId: string
    targetName: string
}

interface CompleteDateActivity extends BaseActivity {
    type: "completeDate"
    targetId: string
    targetName: string
}

interface IncompleteDateActivity extends BaseActivity {
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

// Interface for the main object
export interface ActivitiesResponse {
    activities: Activity[]
}
