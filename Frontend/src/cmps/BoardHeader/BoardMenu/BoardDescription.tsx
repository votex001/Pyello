import { useSelector } from "react-redux"
import { UserAvatar } from "../../UserAvatar"
import { useEffect, useRef, useState } from "react"
import TextArea, { TextAreaRef } from "antd/es/input/TextArea"
import { useClickOutside } from "../../../customHooks/useClickOutside"
import { updateBoard } from "../../../store/actions/board.actions"
import { ProfilePopover } from "../../Task/ManageTaskPopovers/ProfilePopover"
import { RootState } from "../../../store/store"
import { User } from "../../../models/user.model"

interface BoardDescriptionProps {
    onSetPreventLoad: (b: boolean) => void
}

export function BoardDescription({ onSetPreventLoad }: BoardDescriptionProps) {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const users = useSelector((state: RootState) => state.userModule.users)
    const members = useSelector(
        (state: RootState) => state.boardModule.board?.members
    )
    const admins = members?.filter((m) => m.permissionStatus === "admin")
    const [admin, setAdmin] = useState<User | null>(null)
    const [areaDivRef, isOpen, setIsOpen] = useClickOutside(false)
    const areaRef = useRef<TextAreaRef>(null)
    const [areaValue, setAreaValue] = useState(
        board?.desc ||
            "Add a description to let your teammates know what this board is used for." +
                " You’ll get bonus points if you add instructions for how to collaborate!"
    )
    const minRows = isOpen ? 5 : 0
    useEffect(() => {
        if (isOpen) {
            setAreaValue(board?.desc || "")
            if (areaRef && areaRef.current) {
                const textAreaElement =
                    areaRef.current.resizableTextArea?.textArea
                textAreaElement?.focus()
            }
        } else {
            setAreaValue(
                board?.desc ||
                    "Add a description to let your teammates know what this board is used for." +
                        " You’ll get bonus points if you add instructions for how to collaborate!"
            )
        }
    }, [isOpen])

    useEffect(() => {
        if (admins?.length === 1) {
            getAdmin()
        }
    }, [admins])
    async function getAdmin() {
        if (!users || !admins) return
        const user = users.find((u) => u.id === admins[0].id)
        if (user) {
            setAdmin(user)
        }
    }
    function onChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setAreaValue(e.target.value)
    }
    async function onSaveDescription() {
        onSetPreventLoad(true)
        setIsOpen(false)
        if (board) {
            await updateBoard({ ...board, desc: areaValue })
        }
        onSetPreventLoad(false)
    }
    return (
        <section className="board-description navigation">
            <div className="board-admins">
                <header className="admins-header">
                    <span className="pyello-icon icon-member" />
                    <h3>Board admins</h3>
                </header>
                {!!admins?.length && (
                    <main className="admins-main">
                        {admins.length > 1 ? (
                            <section className="admins-avatars">
                                {admins.map((a) => {
                                    return (
                                        <ProfilePopover
                                            key={a.id}
                                            anchorEl={
                                                <UserAvatar
                                                    memberId={a.id}
                                                    size={32}
                                                    className={"member"}
                                                />
                                            }
                                            memberId={a.id}
                                        />
                                    )
                                })}
                            </section>
                        ) : (
                            <section className="admin-profile">
                                <UserAvatar memberId={admin?.id} size={50} />
                                <div className="info">
                                    <h3 className="fullname">
                                        {admin?.fullName}
                                    </h3>
                                    <p className="username">
                                        @{admin?.username}
                                    </p>
                                    <p className="bio">{admin?.bio}</p>
                                </div>
                            </section>
                        )}
                    </main>
                )}
            </div>
            <div
                className={`description ${
                    !board?.members.some((m) => m.id === user?.id) &&
                    !user?.isAdmin
                        ? "disable"
                        : ""
                }`}
            >
                <header className="description-header">
                    <span className="pyello-icon icon-description" />
                    <h3>Description</h3>
                    {!isOpen &&
                        (board?.members.some((m) => m.id === user?.id) ||
                            user?.isAdmin) && (
                            <button
                                className="edit-btn"
                                onClick={() => setIsOpen(true)}
                            >
                                Edit
                            </button>
                        )}
                </header>
                <main
                    className={`description-main ${isOpen ? "open" : ""} ${
                        !board?.desc ? "add-desc" : ""
                    } `}
                    ref={areaDivRef}
                >
                    <TextArea
                        ref={areaRef}
                        onClick={() => setIsOpen(true)}
                        className="description-area"
                        autoSize={{ minRows: minRows }}
                        value={areaValue}
                        onChange={onChangeDescription}
                    />
                    {isOpen && (
                        <div className="btns">
                            <button
                                className="btn primal"
                                onClick={onSaveDescription}
                            >
                                Save
                            </button>
                            <button
                                className="btn"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </section>
    )
}
