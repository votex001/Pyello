import { useState, useRef, useEffect } from "react"
import { PlusOutlined, CloseOutlined } from "@ant-design/icons"
import { Input, InputRef } from "antd"
import { Card } from "antd"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"

interface AddGroupBtn {
    addGroup?: (name: string) => void
}

export function AddGroupBtn({ addGroup }: AddGroupBtn) {
    const [isAddGroupOpen, setIsAddGroupOpen] = useState(false)
    const [groupName, setGroupName] = useState("")
    const inputRef = useRef<InputRef>(null)
    const user = useSelector((state: RootState) => state.userModule.user)
    const board = useSelector((state: RootState) => state.boardModule.board)

    useEffect(() => {
        if (inputRef.current) {
            const inputElement = inputRef.current
            inputElement.focus()
        }
    }, [isAddGroupOpen])

    async function onAddGroup() {
        if (groupName.trim() === "") {
            setIsAddGroupOpen(false)
        } else {
            if (addGroup) {
                addGroup(groupName)
            }
        }
        setGroupName("")
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            onAddGroup()
        } else if (e.key === "Escape") {
            setIsAddGroupOpen(false)
            setGroupName("")
        }
    }

    const addListBtnTitle =
        board?.groups.filter((g) => !g.closed).length === 0
            ? "Add a list"
            : "Add another list"
    return (
        <>
            {(board?.members.some((m) => m.id === user?.id) ||
                user?.isAdmin) && (
                <div className="add-group-btn-wrapper">
                    {!isAddGroupOpen && (
                        <button
                            className="add-group-btn"
                            onClick={() => setIsAddGroupOpen(true)}
                        >
                            <span className="add-group-btn-text">
                                <PlusOutlined />
                                &nbsp;{addListBtnTitle}
                            </span>
                        </button>
                    )}
                    {isAddGroupOpen && (
                        <Card className="add-group-in-board-card">
                            <Input
                                ref={inputRef}
                                className="add-group-input"
                                placeholder="Enter list title..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                            <article className="footer-actions">
                                <button
                                    onClick={() => onAddGroup()}
                                    className="add-card-btn"
                                >
                                    Add list
                                </button>
                                <button
                                    onClick={() => setIsAddGroupOpen(false)}
                                    className="close-add-card-btn"
                                >
                                    <CloseOutlined />
                                </button>
                            </article>
                        </Card>
                    )}
                </div>
            )}
        </>
    )
}
