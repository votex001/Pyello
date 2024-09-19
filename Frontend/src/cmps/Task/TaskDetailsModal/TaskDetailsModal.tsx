import { Modal } from "antd"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { MoveCardPopover } from "../ManageTaskPopovers/MoveCardPopover"
import { TaskDetailsAddToCard } from "./TaskDetailsAddToCard"
import { TaskDetailsActions } from "./TaskDetailsActions"
import { SvgButton } from "../../CustomCpms/SvgButton"
import { TaskDetailsMembers } from "./TaskDetailsMembers"
import { ManageCoverPopover } from "../ManageTaskPopovers/ManageCoverPopover"
import coverIcon from "/img/board-index/detailsImgs/coverIcon.svg"
import { ReactSVG } from "react-svg"
import detailsIcon from "/img/board-index/detailsImgs/detailsIcon.svg"
import { utilService } from "../../../services/util.service"
import { TaskDetailsLabels } from "./TaskDetailsLabels"
import { TaskDetailsMarkdown } from "./TaskDetailsMarkdown"
import { NameInput } from "../../CustomCpms/NameInput"
import { TaskDetailsCheckList } from "./TaskDetailsCheckList"
import { TaskDetailsDates } from "./TaskDetailsDates"
import { addTask, editTask } from "../../../store/actions/board.actions"
import { TaskDetailsAttachment } from "./TaskDetailsAttachment"
import { ManageAttachmentsPopover } from "../ManageTaskPopovers/ManageAttachmentsPopover"
import { useDocumentTitle } from "../../../customHooks/useDocumentTitle"
import { RootState } from "../../../store/store"
import {
    Activity,
    JoinTaskActivity,
    RemoveCheckListActivity,
} from "../../../models/activities.models"
import { CheckList } from "../../../models/task&groups.models"

interface TaskDetailsModalProps {
    taskId: string
    onCloseTask: () => void
}

export function TaskDetailsModal({
    taskId,
    onCloseTask,
}: TaskDetailsModalProps) {
    const group = useSelector((state: RootState) =>
        state.boardModule.board?.groups.find((g) =>
            g.tasks?.find((t) => t.id === taskId)
        )
    )
    const task = useSelector((state: RootState) =>
        state.boardModule.board?.groups
            ?.find((g) => g.tasks?.find((t) => t.id === taskId))
            ?.tasks.find((t) => t.id === taskId)
    )
    const board = useSelector((state: RootState) => state.boardModule.board)
    useDocumentTitle(`${task?.name} on ${board?.name} | Pyello`)
    const [openedInputId, setOpenedInputId] = useState("")

    const user = useSelector((state: RootState) => state.userModule.user)
    const navigate = useNavigate()

    const isMember = user ? task?.idMembers?.includes(user?.id) : null
    const hasMembers = task ? task?.idMembers?.length > 0 : null
    const isImgCover = task?.cover?.attachment
    const isColorCover = task?.cover?.color
    const isNoCover = !task?.cover?.attachment && !task?.cover?.color

    async function onJoin() {
        if (!task || !user) return
        const newActivity = utilService.createActivity(
            {
                type: "joinTask",
                targetId: task.id,
                targetName: task.name,
            },
            user
        ) as JoinTaskActivity

        await editTask(
            {
                ...task,
                idMembers: [...task.idMembers, user.id],
            },
            newActivity
        )
    }

    function onClose(e: any) {
        if (e.key === "Escape") return
        onCloseTask()
        navigate(`/b/${task?.idBoard}`, { replace: true })
    }

    function onRenameTask(name: string) {
        if (task) editTask({ ...task, name })
    }

    if (!task) {
        return <></>
    }

    const brightness = task?.cover?.attachment
        ? task?.cover?.attachment?.avgBgColor.isDark
            ? "dark"
            : "light"
        : task?.cover?.color
        ? task?.cover?.brightness
        : "light"

    const colorCoverHeader = (
        <section
            className={`details-header-color-cover ${
                !isColorCover ? "no-cover" : ""
            }`}
            style={{
                backgroundColor: utilService.getColorHashByName(
                    task.cover.color
                )?.bgColor,
            }}
        >
            <article className={`details-header-cover-actions-wrapper`}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <ManageCoverPopover
                        anchorEl={
                            <SvgButton
                                src={coverIcon}
                                className={`cover-btn ${brightness}`}
                                label="Cover"
                            />
                        }
                        task={task}
                    />
                </div>
            </article>
        </section>
    )

    const imgCoverHeader = (
        <section
            className={`details-header-img-cover ${brightness} ${
                !isImgCover ? "no-cover" : ""
            }`}
            style={{
                backgroundColor: task?.cover?.attachment?.avgBgColor?.color,
            }}
        >
            {task?.cover?.attachment && (
                <img src={task?.cover?.attachment.link} alt="task cover" />
            )}
            <article className={`details-header-cover-actions-wrapper`}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <ManageCoverPopover
                        anchorEl={
                            <SvgButton
                                src={coverIcon}
                                className={`cover-btn ${brightness}`}
                                label="Cover"
                            />
                        }
                        task={task}
                    />
                </div>
            </article>
        </section>
    )

    // checkList functions
    function changeCheckList(checkListId: string, changes: Partial<CheckList>) {
        if (!task) return
        const updatedTask = {
            ...task,
            checkLists: task.checkLists.map((c) =>
                c.id === checkListId ? { ...c, ...changes } : c
            ),
        }
        editTask(updatedTask)
    }
    async function changeItem(
        checkListId: string,
        itemId: string,
        changes: Partial<CheckList>,
        activity: Activity
    ) {
        if (!task) return
        const updatedTask = {
            ...task,
            checkLists: task.checkLists.map((c) =>
                c.id === checkListId
                    ? {
                          ...c,
                          checkItems: c.checkItems.map((i) =>
                              i.id === itemId ? { ...i, ...changes } : i
                          ),
                      }
                    : c
            ),
        }
        editTask(updatedTask, activity)
    }

    async function deleteList(checkList: CheckList) {
        if (!task || !user) return
        const newActivity = utilService.createActivity(
            {
                type: "removeCheckList",
                targetId: task.id,
                targetName: task.name,
                checklistName: checkList.label,
            },
            user
        ) as RemoveCheckListActivity
        const newTask = {
            ...task,
            checkLists: task.checkLists.filter((c) => c.id !== checkList.id),
        }

        await editTask(newTask, newActivity)
    }

    function deleteItem(listId: string, itemId: string) {
        if (!task) return
        const newTask = {
            ...task,
            checkLists: task.checkLists.map((c) =>
                c.id === listId
                    ? {
                          ...c,
                          checkItems: c.checkItems.filter(
                              (i) => i.id !== itemId
                          ),
                      }
                    : c
            ),
        }
        editTask(newTask)
    }

    async function createAsTask(name: string) {
        if (!task || !user || !group || !board) return
        let maxPos = group?.tasks.reduce(
            (max, item) => (item.pos > max ? item.pos : max),
            0
        )
        maxPos
        const newTask = {
            ...task,
            name,
            pos: maxPos || 0 + 1000,
            groupId: task?.idGroup,
            idBoard: task?.idBoard,
            addToTop: false,
        }

        await addTask(newTask, user, group, 0, board)
    }

    function onSetOpenId(id: string) {
        setOpenedInputId(id)
    }

    return (
        <Modal
            open
            onCancel={onClose}
            loading={group == undefined}
            footer=""
            className={`task-details ${brightness}`}
        >
            {task.closed && (
                <section className="closed-task">
                    <span className="pyello-icon icon-archive" />
                    <span className="text">This card is archived.</span>
                </section>
            )}
            {colorCoverHeader}
            {imgCoverHeader}
            <article className="details-header">
                <ReactSVG src={detailsIcon} className="icon" wrapper="span" />
                <span className="info">
                    <NameInput
                        className="task-name"
                        value={task.name}
                        maxRows={5}
                        expandInputWidth={false}
                        maxLength={0}
                        onSubmit={onRenameTask}
                    />
                    <span className="task-group">
                        in list{" "}
                        <MoveCardPopover
                            task={task}
                            anchorEl={
                                <a className="group-link">{group?.name}</a>
                            }
                        />
                    </span>
                </span>
            </article>

            <main className="details-body">
                <section className="details-body__left">
                    <article className="subsection wrap-section">
                        {hasMembers && (
                            <TaskDetailsMembers currentTask={task} />
                        )}
                        {task?.idLabels?.length > 0 && (
                            <TaskDetailsLabels task={task} />
                        )}
                        {(task.start || task.due) && (
                            <TaskDetailsDates task={task} />
                        )}
                    </article>
                    <TaskDetailsMarkdown task={task} />
                    {task?.checkLists?.length > 0 &&
                        task?.checkLists
                            ?.sort((a, b) => a.pos - b.pos)
                            .map((checkList) => (
                                <TaskDetailsCheckList
                                    task={task}
                                    checkList={checkList}
                                    key={checkList.id}
                                    changeCheckList={changeCheckList}
                                    changeItem={changeItem}
                                    deleteList={deleteList}
                                    deleteItem={deleteItem}
                                    createAsTask={createAsTask}
                                    openedInputId={openedInputId}
                                    setOpenedInputId={onSetOpenId}
                                />
                            ))}
                    {task?.attachments?.length > 0 && (
                        <section className="attachments-section">
                            <header className="task-details-section-header">
                                <ReactSVG
                                    src="/img/taskBadges/file.svg"
                                    wrapper="span"
                                    className="section-icon"
                                />
                                <h3 className="section-title">Attachments</h3>
                                <ManageAttachmentsPopover
                                    task={task}
                                    anchorEl={
                                        <button className="add-attachment-btn">
                                            Add
                                        </button>
                                    }
                                />
                            </header>
                            {task?.attachments.map((attachment) => (
                                <TaskDetailsAttachment
                                    key={attachment.id}
                                    attachment={attachment}
                                    task={task}
                                />
                            ))}
                        </section>
                    )}
                </section>
                <section className="details-body__right">
                    {!isMember && (
                        <article className="suggestions">
                            <p className="sub-title">Suggested</p>
                            <button
                                className="details-anchor-btn"
                                onClick={onJoin}
                            >
                                <label className="pyello-icon icon-member " />
                                <label className="btn-label">Join</label>
                            </button>
                        </article>
                    )}
                    <TaskDetailsAddToCard task={task} isNoCover={isNoCover} />
                    <TaskDetailsActions task={task} />
                </section>
            </main>
        </Modal>
    )
}
