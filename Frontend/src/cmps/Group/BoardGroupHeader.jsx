import { useState, useRef, useEffect } from "react"
import { GroupActionsMenuPopover } from "./GroupActionsMenuPopover"
import { Input } from "antd"
import { editGroup } from "../../store/board.actions"
import { useSelector } from "react-redux"
const { TextArea } = Input

export function BoardGroupHeader({
    draggableProvided,
    group,
    openAddTask,
    copyGroup,
    moveAllCards,
    archiveAllCards,
    sortGroup,
}) {
    const [isEditGroupName, setIsEditGroupName] = useState(false)
    const [newGroupName, setNewGroupName] = useState(group.name)
    const textAreaRef = useRef(null)
    const board = useSelector((state) => state.boardModule.board)

    useEffect(() => {
        if (textAreaRef.current) {
            const textAreaElement =
                textAreaRef.current.resizableTextArea.textArea
            textAreaElement.focus()
            textAreaElement.setSelectionRange(0, textAreaElement.value.length) // Select all text
        }
    }, [isEditGroupName])

    async function onKeyDown(e) {
        if (e.key === "Enter" || e.key === "Escape") {
            e.preventDefault()
            onRenameGroup()
        }
    }

    async function onRenameGroup() {
        setIsEditGroupName(false)
        if (newGroupName === group.name || newGroupName.trim() === "") {
            return
        }
        await editGroup(board.id, { ...group, name: newGroupName })
    }

    return (
        <header
            className="board-group-header"
            {...draggableProvided.dragHandleProps}
        >
            {isEditGroupName ? (
                <TextArea
                    ref={textAreaRef}
                    className="group-title-input"
                    autoSize={{ minRows: 1 }}
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
            <GroupActionsMenuPopover
                openAddTask={openAddTask}
                group={group}
                copyGroup={copyGroup}
                moveAllCards={moveAllCards}
                archiveAllCards={archiveAllCards}
                sortGroup={sortGroup}
            />
        </header>
    )
}
