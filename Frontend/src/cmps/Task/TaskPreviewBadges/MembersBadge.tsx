import { useSelector } from "react-redux"
import { UserAvatar } from "../../UserAvatar"
import { ProfilePopover } from "../ManageTaskPopovers/ProfilePopover"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"

interface MembersBadgeProps {
    task?: Task
}

export function MembersBadge({ task }: MembersBadgeProps) {
    const members = useSelector(
        (state: RootState) => state.boardModule.board?.members
    )
    const users = useSelector((state: RootState) => state.userModule.users)
    const taskMembers =
        members?.filter((member) => task?.idMembers.includes(member?.id)) || []

    return (
        <div className="members-badge">
            {taskMembers.map((member) => {
                const currentUser = users?.find((u) => u.id === member.id)
                return (
                    <ProfilePopover
                        memberId={member.id}
                        key={member.id}
                        anchorEl={
                            <UserAvatar
                                memberId={member.id}
                                onClick={(e: MouseEvent) => e.stopPropagation()}
                                memberProp={{
                                    ...member,
                                    imgUrl: currentUser?.imgUrl,
                                }}
                            />
                        }
                    />
                )
            })}
        </div>
    )
}
