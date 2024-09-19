import { useState, useRef, useEffect } from "react"
import { GroupActionsMenuPopover } from "./GroupActionsMenuPopover"
import { Input, InputRef } from "antd"
import { Group } from "../../models/task&groups.models"
import { editGroup } from "../../store/actions/board.actions"
interface BoardGroupHeaderProps {
    draggableProvided: {
        dragHandleProps?: React.HTMLProps<HTMLDivElement> | null
    }
    group: Group
    openAddTask: () => void
}
export function BoardGroupHeader({
    draggableProvided,
    group,
    openAddTask,
}: BoardGroupHeaderProps) {
    const [isEditGroupName, setIsEditGroupName] = useState<boolean>(false)
    const [newGroupName, setNewGroupName] = useState<string>(group.name)
    const inputRef = useRef<InputRef>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
            // Ensure text is selected
            const inputElement = inputRef.current.input as HTMLInputElement
            inputElement.setSelectionRange(0, inputElement.value.length) // Select all text
        }
    }, [isEditGroupName])

    async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault()
            onRenameGroup()
        }
    }

    function onRenameGroup() {
        setIsEditGroupName(false)
        if (newGroupName === group.name || newGroupName.trim() === "") {
            return
        }
        editGroup(group.idBoard, { ...group, name: newGroupName })
    }

    return (
        <header
            className="board-group-header"
            {...draggableProvided.dragHandleProps}
        >
            {isEditGroupName ? (
                <Input
                    ref={inputRef}
                    className="group-title-input"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={onRenameGroup}
                />
            ) : (
                <p
                    className="group-title"
                    onClick={() => setIsEditGroupName(true)}
                >
                    {group.name}
                </p>
            )}
            <GroupActionsMenuPopover openAddTask={openAddTask} group={group} />
        </header>
    )
}
