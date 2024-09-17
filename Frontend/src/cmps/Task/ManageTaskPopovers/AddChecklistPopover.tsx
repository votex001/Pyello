import { CloseOutlined } from "@ant-design/icons"
import Popup, { TriggerProps } from "@atlaskit/popup"
import { useState, useEffect, useRef } from "react"
import { utilService } from "../../../services/util.service"
import { useSelector } from "react-redux"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import { editTask, updateBoard } from "../../../store/actions/board.actions"
import { AddCheckListActivity } from "../../../models/activities.models"

interface AddChecklistPopoverProps {
    anchorEl: React.ReactNode
    task: Task
}

export function AddChecklistPopover({
    anchorEl,
    task,
}: AddChecklistPopoverProps) {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [checklistName, setChecklistName] = useState("Checklist")

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
                inputRef.current?.select()
            }, 30)
        }
        return () => {
            setChecklistName("Checklist")
        }
    }, [isOpen])

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setChecklistName(e.target.value)
    }

    async function onSubmit() {
        var minPos = 12222
        //add taskId to checkListTaskIds
        if (task && user && board) {
            const newActivity = utilService.createActivity(
                {
                    type: "addCheckList",
                    targetId: task.id,
                    targetName: task.name,
                    checklistName: checklistName,
                },
                user
            ) as AddCheckListActivity
            if (
                !board.checkListTaskIds.length ||
                !board.checkListTaskIds.includes(task.id)
            ) {
                await updateBoard({
                    ...board,
                    checkListTaskIds: [...board.checkListTaskIds, task.id],
                })
            }
            if (task.checkLists.length > 0) {
                minPos = task.checkLists.reduce(
                    (min, item) => (item.pos > min ? item.pos : min),
                    task.checkLists[0].pos
                )
            }
            const newCheckList = utilService.createCheckList({
                label: checklistName,
                pos: minPos - 1000,
            })
            const newTask = {
                ...task,
                checkLists: [...task.checkLists, newCheckList],
            }
            setChecklistName("Checklist")
            setIsOpen(!isOpen)
            await editTask(newTask, newActivity)
        }
    }

    const content = (
        <section className="add-checklist-popover">
            <header className="checklist-header">
                <span>Add CheckList</span>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="close-btn-popover"
                >
                    <CloseOutlined />
                </button>
            </header>
            <div className="checklist-main">
                <h2>Title</h2>
                {isOpen && (
                    <input
                        ref={inputRef}
                        className="checklist-title-input"
                        value={checklistName}
                        onChange={onChange}
                    />
                )}

                <button className="add-btn" onClick={onSubmit}>
                    Add
                </button>
            </div>
        </section>
    )

    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: TriggerProps) => {
        return (
            <label
                {...triggerProps}
                // isSelected={isOpen}
                onClick={onTriggerClick}
            >
                {anchorEl}
            </label>
        )
    }

    return (
        <Popup
            id="add-checklist-popover-popup"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => content}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
