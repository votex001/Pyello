import { utilService } from "../../../services/util.service"
import { Tooltip } from "antd"
import React, { useMemo } from "react"
import dayjs from "dayjs"
import { Task } from "../../../models/task&groups.models"
import { editTask } from "../../../store/actions/board.actions"
import {
    CompleteDateActivity,
    IncompleteDateActivity,
} from "../../../models/activities.models"

interface DateBadgeProps {
    task?: Task
}

export function DateBadge({ task }: DateBadgeProps) {
    //useMemo is used to deal with the re-mount after drag and drop between lists that lead to a flicker of the component
    const dateLabel = useMemo(() => {
        if (!dayjs(task?.start).isValid() && !dayjs(task?.due).isValid()) {
            return null
        } else if (task) {
            return utilService.datePreviewTitle(task.start, task.due)
        }
    }, [task?.start, task?.due])
    if (!task) return
    const [dueStatus, dueTooltip] = utilService.taskDueStatus(task)

    async function onDateClick(e: React.MouseEvent<HTMLSpanElement>) {
        e.stopPropagation()
        if (!task) return
        const activityType = !task?.dueComplete
            ? "completeDate"
            : "incompleteDate"
        const activity = {
            targetId: task?.id,
            targetName: task?.name,
            type: activityType,
        } as CompleteDateActivity | IncompleteDateActivity

        editTask({ ...task, dueComplete: !task?.dueComplete }, activity)
    }

    return (
        <>
            {dateLabel && (
                <Tooltip
                    placement="bottom"
                    title={dueTooltip}
                    key="dates"
                    arrow={false}
                    overlayInnerStyle={utilService.tooltipOuterStyle()}
                >
                    <span
                        className={`task-icon-wrapper dates ${
                            task.dueComplete && "completed"
                        } ${dueStatus}`}
                        onClick={onDateClick}
                    >
                        {task.dueComplete ? (
                            <>
                                <label className="pyello-icon icon-clock task-icon default-icon"></label>
                                <label className="pyello-icon icon-checklist task-icon hover-icon"></label>
                            </>
                        ) : (
                            <>
                                <label className="pyello-icon icon-clock task-icon default-icon"></label>
                                <label className="pyello-icon icon-checkbox-unchecked task-icon hover-icon"></label>
                            </>
                        )}
                        <span className="task-icon-count">{dateLabel}</span>
                    </span>
                </Tooltip>
            )}
            {!dateLabel && <></>}
        </>
    )
}
