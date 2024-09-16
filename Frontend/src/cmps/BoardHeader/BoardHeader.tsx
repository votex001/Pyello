import { useSelector } from "react-redux"
import { UserAddOutlined, EllipsisOutlined } from "@ant-design/icons"
import { UserAvatar } from "../UserAvatar"
import { VisibilityButton } from "./VisibilityButton"
import { ViewsButton } from "./ViewsButton"
import { ProfilePopover } from "../Task/ManageTaskPopovers/ProfilePopover"
import { StarBoardBtn } from "../CustomCpms/StarBoardBtn"
import { NameInput } from "../CustomCpms/NameInput"
import { updateBoard } from "../../store/actions/board.actions"
import { utilService } from "../../services/util.service"
import { useState } from "react"
import { AddModule } from "./AddModule"
import adminPng from "/img/admin.png"
import { RootState } from "../../store/store"
import { RenameBoardActivity } from "../../models/activities.models"

interface BoardHeaderProps {
    starredBoardIds?: string[]
    starToggle?: (value: string[]) => void
    openBoardMenu?: boolean
    setOpenBoardMenu?: React.Dispatch<React.SetStateAction<boolean>>
    showBtn?: boolean
    setShowBtn?: React.Dispatch<React.SetStateAction<boolean>>
}

export function BoardHeader({
    starredBoardIds,
    starToggle,
    openBoardMenu,
    setOpenBoardMenu,
    showBtn,
    setShowBtn,
}: BoardHeaderProps) {
    const members = useSelector(
        (state: RootState) => state.boardModule.board?.members
    )
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const [openAdd, setOpenAdd] = useState(false)
    function onToggleStar(boardId: string) {
        const starredIds = starredBoardIds?.includes(boardId)
            ? starredBoardIds.filter((id) => id !== boardId)
            : [...(starredBoardIds || []), boardId]
        if (starToggle) {
            starToggle(starredIds)
        }
    }

    function onBoardNameChange(name: string) {
        if (board && user) {
            const newActivity = utilService.createActivity(
                {
                    type: "renameBoard",
                    previousName: board.name,
                },
                user
            ) as RenameBoardActivity

            updateBoard({
                ...board,
                name,
                activities: [...board?.activities, newActivity],
            })
        }
    }
    function openMenu() {
        if (setOpenBoardMenu) {
            setOpenBoardMenu(true)
        }
        if (setShowBtn) {
            setShowBtn(false)
        }
    }

    return (
        <div className="board-header">
            <div
                className={`left-info ${
                    board?.prefs?.backgroundBrightness === "dark" ? "" : "dark"
                }`}
            >
                {board?.members.some(
                    (m) => m.id === user?.id && m.permissionStatus === "admin"
                ) || user?.isAdmin ? (
                    <NameInput
                        value={board?.name}
                        className="board-name"
                        onSubmit={onBoardNameChange}
                    />
                ) : (
                    <section className="name-input board-name ">
                        <span className="cursor">{board?.name}</span>
                    </section>
                )}
                <StarBoardBtn
                    starredBoardIds={starredBoardIds}
                    boardId={board?.id}
                    starClick={onToggleStar}
                />
                <VisibilityButton />
                <ViewsButton />
            </div>
            <div
                className={`right-info ${
                    board?.prefs?.backgroundBrightness === "dark" ? "" : "dark"
                }`}
            >
                {/* <FilterButton /> */}
                <div className="members">
                    {members?.slice(-5).map((member) => (
                        <ProfilePopover
                            memberId={member?.id}
                            placement="bottom"
                            key={member.id}
                            anchorEl={
                                <div className="member-wrapper">
                                    <UserAvatar
                                        memberId={member?.id}
                                        key={member?.id}
                                        size={28}
                                        className="members-avatar"
                                    />
                                    {member.permissionStatus === "admin" && (
                                        <img
                                            src={adminPng}
                                            className="admin-png"
                                        />
                                    )}
                                </div>
                            }
                        />
                    ))}
                </div>

                <button
                    className="add-btn"
                    disabled={
                        !board?.members.some((m) => m.id === user?.id) &&
                        !user?.isAdmin
                    }
                    onClick={() => setOpenAdd(true)}
                >
                    <UserAddOutlined className="share-icon" />
                    <span className="txt">Share</span>
                </button>

                {(!openBoardMenu || showBtn) && (
                    <button className="dots" onClick={openMenu}>
                        <EllipsisOutlined />
                    </button>
                )}
            </div>
            {openAdd && <AddModule onClose={() => setOpenAdd(false)} />}
        </div>
    )
}
