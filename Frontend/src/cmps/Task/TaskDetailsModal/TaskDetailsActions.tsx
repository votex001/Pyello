import labelIcon from "/img/board-index/headerImgs/filterBtn-imgs/labelIcon.svg"
import defaultProfile from "/img/defaultProfile.svg"
import checkListIcon from "/img/board-index/detailsImgs/checkListIcon.svg"

import { MoveCardPopover } from "../ManageTaskPopovers/MoveCardPopover"
import { editTask, updateBoard } from "../../../store/actions/board.actions"
import { useSelector } from "react-redux"
import { ActionPopover } from "../../BoardHeader/BoardMenu/ActionPopover"
import { useNavigate } from "react-router"
import { utilService } from "../../../services/util.service"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import {
    ArchiveTaskActivity,
    UnArchiveActivity,
} from "../../../models/activities.models"

interface TaskDetailsActionsProps {
    task?: Task
}

export function TaskDetailsActions({ task }: TaskDetailsActionsProps) {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const navigate = useNavigate()
    function onArchiveTask() {
        if (!user || !task) return
        const newActivity = utilService.createActivity(
            {
                type: "archiveTask",
                targetId: task.id,
                targetName: task.name,
            },
            user
        ) as ArchiveTaskActivity
        if (task) {
            editTask({ ...task, closed: true }, newActivity)
        }
    }
    async function onSendBack() {
        if (!task || !board || !user) return
        const newActivity = utilService.createActivity(
            {
                type: "unArchive",
                targetId: task.id,
                targetName: task.name,
            },
            user
        ) as UnArchiveActivity
        task.closed = false
        await updateBoard({
            ...board,
            groups: board.groups.map((g) =>
                g.id === task.idGroup
                    ? {
                          ...g,
                          tasks: g.tasks.map((t) =>
                              t.id === task.id ? task : t
                          ),
                      }
                    : g
            ),
            activities: [...board?.activities, newActivity],
        })
    }
    async function onDeleteTask() {
        if (!board || !task) return
        const newBoard = {
            ...board,
            groups: board.groups.map((g) =>
                g.id === task.idGroup
                    ? {
                          ...g,
                          tasks: g.tasks.filter((t) => t.id !== task.id),
                      }
                    : g
            ),
        }
        await updateBoard(newBoard)
        navigate(`/b/${board?.id}`)
    }
    // /////////////////
    const actions = [
        { svg: defaultProfile, text: "Move" },
        {
            popover: (
                <MoveCardPopover
                    task={task}
                    anchorEl={
                        <button className="details-anchor-btn">
                            <label className="pyello-icon icon-move " />
                            <label className="btn-label">Move</label>
                        </button>
                    }
                />
            ),
        },
        { svg: labelIcon, text: "Copy" },
        { svg: checkListIcon, text: "Make template" },
        {
            popover: task?.closed ? (
                <>
                    <button className="details-anchor-btn" onClick={onSendBack}>
                        <label className="pyello-icon icon-refresh " />
                        <label className="btn-label">Send to board</label>
                    </button>
                    <ActionPopover
                        action={"Delete card?"}
                        deleteTask={onDeleteTask}
                        anchorEl={
                            <button className="details-anchor-btn delete">
                                <label className="pyello-icon icon-remove " />
                                <label className="btn-label">Delete</label>
                            </button>
                        }
                    />
                </>
            ) : (
                <button className="details-anchor-btn" onClick={onArchiveTask}>
                    <label className="pyello-icon icon-archive " />
                    <label className="btn-label">Archive</label>
                </button>
            ),
        },
        { svg: "/img/taskBadges/file.svg", text: "Share" },
    ]
    return (
        <section>
            <p className="sub-title">Actions</p>
            {actions.map((btn, index) => (
                <div key={index}>{btn.popover}</div>
            ))}
        </section>
    )
}
