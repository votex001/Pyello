import { CloseOutlined } from "@ant-design/icons"
import { UserAvatar } from "../../UserAvatar"
import { Link } from "react-router-dom"
import { Popover } from "antd"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../store/store"
import { TooltipPlacement } from "antd/es/tooltip"

interface ProfilePopover {
    memberId: string
    anchorLinks: React.ReactNode
    anchorEl: React.ReactNode
    placement: TooltipPlacement
}

export function ProfilePopover({
    memberId,
    anchorLinks,
    anchorEl,
    placement = "bottomLeft",
}: ProfilePopover) {
    const member = useSelector((state: RootState) =>
        state.userModule.users?.find((u) => u?.id === memberId)
    )
    const [isOpen, setIsOpen] = useState(false)
    const user = useSelector((state: RootState) => state.userModule.user)
    const currentMember = useSelector((state: RootState) =>
        state.userModule.users?.find((user) => user?.id === member?.id)
    )

    return (
        <Popover
            trigger="click"
            placement={placement}
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section
                    className="profile-popover"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div onClick={() => setIsOpen(false)} className="close-btn">
                        <CloseOutlined />
                    </div>
                    <header className="profile-header">
                        <UserAvatar
                            memberId={currentMember?.id}
                            size={88}
                            offTitle={true}
                            title={`${currentMember?.fullName} (${currentMember?.username})`}
                        />
                        <div className="profile-info">
                            <span
                                className="profile-name"
                                title={currentMember?.fullName}
                            >
                                {currentMember?.fullName}
                            </span>
                            <span
                                className="profile-username"
                                title={currentMember?.username}
                            >
                                @{currentMember?.username}
                            </span>
                            <span
                                className="profile-bio"
                                title={currentMember?.bio}
                            >
                                {currentMember?.bio}
                            </span>
                        </div>
                    </header>
                    <ul>
                        <Link
                            to={`/u/${currentMember?.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="profile-link"
                        >
                            {user?.id === currentMember?.id ? "Edit" : "View"}{" "}
                            profile info
                        </Link>
                    </ul>
                    {anchorLinks && (
                        <>
                            <hr style={{ margin: "8px 0px" }} />
                            <div className="profile-other">{anchorLinks}</div>
                        </>
                    )}
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
