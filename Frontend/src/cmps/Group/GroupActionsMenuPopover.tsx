import { Popover } from "antd"
import { useState, useRef, useEffect } from "react"
import { EllipsisOutlined } from "@ant-design/icons"
import { ManageTaskPopoverHeader } from "../Task/ManageTaskPopovers/ManageTaskPopoverHeader"
import TextArea, { TextAreaRef } from "antd/es/input/TextArea"
import { useSelector } from "react-redux"
import { Group } from "../../models/task&groups.models"
import { RootState } from "../../store/store"
import {
    archiveAllCards,
    archiveGroup,
    copyGroup,
    moveAllCards,
    sortGroup,
} from "../../store/actions/board.actions"

interface GroupActionsMenuPopoverProps {
    group?: Group
    openAddTask: () => void
}
type ActionOptions =
    | "Copy list"
    | "Move all cards in list"
    | "Archive all cards in list"
    | "Sort by..."

export function GroupActionsMenuPopover({
    group,
    openAddTask,
}: GroupActionsMenuPopoverProps) {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const [openGroupMenu, setOpenGroupMenu] = useState<boolean>(false)
    const [backToList, setBackToList] = useState<(() => void) | null>(null)
    const [action, setAction] = useState<ActionOptions | null>(null)
    const [copyListName, setCopyListName] = useState(group?.name)
    const textAreaRef = useRef<TextAreaRef>(null)

    useEffect(() => {
        if (
            action === "Copy list" &&
            textAreaRef.current &&
            textAreaRef.current.resizableTextArea
        ) {
            const textAreaElement =
                textAreaRef.current.resizableTextArea.textArea
            textAreaElement.focus()
            textAreaElement.setSelectionRange(0, textAreaElement.value.length)
        }
    }, [action])

    function onSelectAddTask() {
        openAddTask()
        setOpenGroupMenu(false)
    }

    function onArchiveGroup() {
        if (!board || !group || !user) return
        archiveGroup(board.id!, group.id, user)
        setOpenGroupMenu(false)
    }

    function onBackToList() {
        setBackToList(null)
        setAction(null)
    }

    function onClose() {
        setOpenGroupMenu(false)
        setAction(null)
    }

    function onSelectCopyList() {
        setAction("Copy list")
        setBackToList(() => onBackToList)
        if (group) {
            setCopyListName(group.name)
        }
    }

    function onCopyGroup() {
        if (!board || !user) return
        setAction(null)
        setBackToList(null)
        setOpenGroupMenu(false)
        if (group && copyListName) {
            copyGroup(board.id!, { ...group, name: copyListName }, user)
        }
    }

    function onSelectMoveAllCards() {
        setAction("Move all cards in list")
        setBackToList(() => onBackToList)
    }

    function onMoveAllCards(targetGroupId: string) {
        setAction(null)
        setBackToList(null)
        setOpenGroupMenu(false)
        if (board && group && user) {
            moveAllCards(board.id!, group.id, targetGroupId, user)
        }
    }

    function onSelectArchiveAllCards() {
        setAction("Archive all cards in list")
        setBackToList(() => onBackToList)
    }
    function onArchiveAllCards() {
        setAction(null)
        setBackToList(null)
        setOpenGroupMenu(false)
        if (board && group && user) {
            archiveAllCards(board.id!, group.id, user)
        }
    }

    function onSelectSortBy() {
        setAction("Sort by...")
        setBackToList(() => onBackToList)
    }

    function onSortBy(sortBy: "name" | "createdAt", sortOrder: "desc" | null) {
        setAction(null)
        setBackToList(null)
        setOpenGroupMenu(false)
        if (group && board) {
            sortGroup(board.id!, group.id, sortBy, sortOrder)
        }
    }
    return (
        <Popover
            className="group-actions-menu-popover"
            trigger="click"
            placement="bottomLeft"
            open={openGroupMenu}
            onOpenChange={setOpenGroupMenu}
            arrow={false}
            content={
                <section className="group-actions-menu-content">
                    <ManageTaskPopoverHeader
                        title={action ? action : "List actions"}
                        close={onClose}
                        back={backToList}
                    />
                    {!action && (
                        <article className="group-actions-menu-actions">
                            <p
                                className="menu-action"
                                onClick={onSelectAddTask}
                            >
                                Add card
                            </p>
                            <p
                                className="menu-action"
                                onClick={onSelectCopyList}
                            >
                                Copy list
                            </p>
                            {/* <p className="menu-action disabled">Move list</p> */}
                            <p
                                className="menu-action"
                                onClick={onSelectMoveAllCards}
                            >
                                Move all cards in the list
                            </p>
                            <p className="menu-action" onClick={onSelectSortBy}>
                                Sort by...
                            </p>
                            {/* <p className="menu-action disabled">Watch</p> */}
                            <hr className="simple-gray-line" />
                            <p className="menu-action" onClick={onArchiveGroup}>
                                Archive this list
                            </p>
                            {group &&
                                group.tasks?.filter((t) => !t.closed)?.length >
                                    0 && (
                                    <p
                                        className="menu-action"
                                        onClick={onSelectArchiveAllCards}
                                    >
                                        Archive all cards in the list
                                    </p>
                                )}
                        </article>
                    )}
                    {action === "Copy list" && (
                        <article className="group-actions-sub-menu">
                            <h3 className="actions-sub-title">Name</h3>
                            <TextArea
                                ref={textAreaRef}
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                value={copyListName}
                                onChange={(e) =>
                                    setCopyListName(e.target.value)
                                }
                                className="copy-list-name-input"
                            />
                            <button
                                className="action-btn"
                                onClick={onCopyGroup}
                            >
                                Create list
                            </button>
                        </article>
                    )}
                    {action === "Move all cards in list" && (
                        <article className="group-actions-menu-actions">
                            {board?.groups
                                .sort((a, b) => a.pos - b.pos)
                                .map((g) => {
                                    if (g.id === group?.id) {
                                        return (
                                            <p
                                                className="menu-action disabled"
                                                key={g.id}
                                            >
                                                {g.name} (current)
                                            </p>
                                        )
                                    }
                                    return (
                                        <p
                                            className="menu-action"
                                            key={g.id}
                                            onClick={() => onMoveAllCards(g.id)}
                                        >
                                            {g.name}
                                        </p>
                                    )
                                })}
                        </article>
                    )}
                    {action === "Archive all cards in list" && (
                        <article className="group-actions-menu-actions">
                            <p className="warning-text">
                                Are you sure you want to archive the selected
                                cards?
                            </p>
                            <button
                                className="action-btn danger-btn"
                                onClick={onArchiveAllCards}
                            >
                                Archive cards
                            </button>
                        </article>
                    )}
                    {action === "Sort by..." && (
                        <article className="group-actions-menu-actions">
                            <p
                                className="menu-action"
                                onClick={() => onSortBy("createdAt", "desc")}
                            >
                                Date created (newest first)
                            </p>
                            <p
                                className="menu-action"
                                onClick={() => onSortBy("createdAt", null)}
                            >
                                Date created (oldest first)
                            </p>
                            <p
                                className="menu-action"
                                onClick={() => onSortBy("name", null)}
                            >
                                Card name (alphabeticlly)
                            </p>
                            {/* <p className="menu-action disabled">Due date</p> */}
                        </article>
                    )}
                </section>
            }
        >
            <button
                className="group-more-btn"
                onClick={() => setOpenGroupMenu(!openGroupMenu)}
            >
                <EllipsisOutlined />
            </button>
        </Popover>
    )
}
