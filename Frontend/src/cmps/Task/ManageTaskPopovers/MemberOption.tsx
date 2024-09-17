import { UserAvatar } from "../../UserAvatar"
import { SvgButton } from "../../CustomCpms/SvgButton"
import { useSelector } from "react-redux"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import { editTask } from "../../../store/actions/board.actions"
import { User } from "../../../models/user.model"

interface MemberOptionProps {
    task?: Task
    member: User
    isSelected: boolean
}

export function MemberOption({ task, member, isSelected }: MemberOptionProps) {
    const user = useSelector((state: RootState) =>
        state.userModule.users?.find((user) => member.id === user.id)
    )

    function onEditTask() {
        if (!task) return

        const newTaskMemberIds = [...task.idMembers]
        if (isSelected) {
            newTaskMemberIds.splice(newTaskMemberIds.indexOf(member.id), 1)
        } else {
            newTaskMemberIds.push(member.id)
        }
        editTask({ ...task, idMembers: newTaskMemberIds })
    }
    return (
        <div className="change-members-option" onClick={onEditTask}>
            {/* //TODO: last minute fix for demo*/}
            <UserAvatar memberId={member?.id} extraMarginToImageFlag={true} />
            <p className="member-option-member-name">{user?.fullName}</p>
            {isSelected && (
                <SvgButton
                    src="/img/xIcon.svg"
                    className="remove-member-button"
                />
            )}
        </div>
    )
}
