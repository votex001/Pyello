import dayjs from "dayjs"
import { ManageDatesPopover } from "../ManageTaskPopovers/ManageDatesPopover"
import { useSelector } from "react-redux"
import { utilService } from "../../../services/util.service"
import { CheckBox } from "../../CustomCpms/CheckBox"
import { RootState } from "../../../store/store"
import { Task } from "../../../models/task&groups.models"
import {
    CompleteDateActivity,
    IncompleteDateActivity,
} from "../../../models/activities.models"
import { editTask } from "../../../store/actions/board.actions"

interface TaskDetailsDatesProps {
    task?: Task
}

export function TaskDetailsDates({ task }: TaskDetailsDatesProps) {
    const user = useSelector((state: RootState) => state.userModule.user)
    const currentTask = useSelector((state: RootState) =>
        state.boardModule.board?.groups
            .find((g) => g.id === task?.idGroup)
            ?.tasks.find((t) => t.id === task?.id)
    )

    async function handleDueChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!task || !user) return
        const newActivity = utilService.createActivity(
            {
                type: e.target.checked ? "completeDate" : "incompleteDate",
                targetId: task.id,
                targetName: task.name,
            },
            user
        ) as CompleteDateActivity | IncompleteDateActivity
        if (e.target.checked) {
            newActivity.type = "completeDate"
        } else {
            newActivity.type = "incompleteDate"
        }

        editTask({ ...task, dueComplete: !e.target.checked }, newActivity)
    }

    const [dueStatus, dueLabel] = taskDueStatus(task)

    return (
        <section className="task-details-dates">
            <p className="sub-title">{getTitle(task)}</p>
            <main className="task-details-dates-main">
                {task?.due && (
                    <CheckBox
                        checked={currentTask?.dueComplete}
                        onChange={handleDueChange}
                        className="due-checkbox"
                    />
                )}
                <ManageDatesPopover
                    task={task}
                    anchorEl={
                        <article className="dates-info">
                            <label className="date-label">
                                {utilService.getDateLabel(task?.start)}
                            </label>
                            {task?.due && task.start && (
                                <label className="date-label"> - </label>
                            )}
                            <label className="date-label">
                                {utilService.getDateLabel(task?.due)}
                            </label>
                            {task?.due && (
                                <label className={`date-alert ${dueStatus}`}>
                                    {dueLabel}
                                </label>
                            )}
                            <label className="pyello-icon icon-down open-popover"></label>
                        </article>
                    }
                />
            </main>
        </section>
    )
}

function taskDueStatus(task?: Task) {
    if (task?.dueComplete) return ["completed", "Complete"]

    const dueDate = dayjs(task?.due)
    const now = dayjs()
    const diff = dueDate.diff(now, "hours")

    if (diff < -24) return ["overdue", "Overdue"]
    if (diff < 0) return ["recently-overdue", "Overdue"]
    if (diff > 24) return ["due", ""]
    if (diff > 0) return ["due-soon", "Due soon"]
    return ["", ""]
}

function getTitle(task?: Task) {
    if (task?.start && task.due) return "Dates"
    if (task?.start) return "Start date"
    if (task?.due) return "Due date"
    return "Dates"
}
