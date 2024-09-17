import { Input, InputRef } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Group } from "../../models/task&groups.models"

interface AddTaskInGroupProps {
    groupId: string
    closeAddTask: () => void
    addTask: (
        newTask: { addToTop: boolean; name: string; groupId: string },
        group: Group
    ) => void
    addToTop: boolean
    onBtnClick?: () => void
    groupRef?: React.RefObject<HTMLElement>
}

export function AddTaskInGroup({
    groupId,
    closeAddTask,
    addTask,
    addToTop,
    onBtnClick,
    groupRef,
}: AddTaskInGroupProps) {
    const group = useSelector((state: RootState) =>
        state.boardModule.board?.groups.find((group) => group.id === groupId)
    )
    const [taskName, setTaskName] = useState("")
    const firstPos = useRef<number | null>(null)
    const lastAddedPos = useRef<number | null>(null)
    const lastPos = useRef<number | null>(null)
    const inputRef = useRef<InputRef>(null)

    useEffect(() => {
        if (group && group.tasks) {
            if (group.tasks?.length > 0) {
                const groupMaxPos = group.tasks
                    .filter((task) => !task.closed)
                    .reduce((max, task) => Math.max(max, task.pos), 0)
                const groupMinPos = group.tasks
                    .filter((task) => !task.closed)
                    .reduce((min, task) => Math.min(min, task.pos), 0)
                firstPos.current = groupMinPos
                lastPos.current = groupMaxPos
            }
        }
    }, [group])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        return () => {
            lastAddedPos.current = null
        }
    }, [])

    async function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault()
            onAddTask()
        }
        if (e.key === "Escape") {
            closeAddTask()
        }
    }

    async function onAddTask() {
        if (!taskName) {
            closeAddTask()
            return
        }

        const newTask = {
            addToTop: addToTop,
            name: taskName,
            groupId: groupId,
        }

        setTaskName("")
        if (group) {
            await addTask(newTask, group)
        }
        if (onBtnClick) {
            onBtnClick()
        }
    }

    return (
        <section
            className={`add-card-in-list-footer ${
                addToTop ? "first-task" : ""
            } ${!addToTop ? "last-task" : ""}`}
            ref={groupRef}
        >
            <Input
                ref={inputRef}
                className="footer-input"
                placeholder="Enter a title for this card"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={onKeyDown}
            />
            <article className="footer-actions">
                <button onClick={onAddTask} className="add-card-btn">
                    Add card
                </button>
                <button onClick={closeAddTask} className="close-add-card-btn">
                    <CloseOutlined />
                </button>
            </article>
        </section>
    )
}
