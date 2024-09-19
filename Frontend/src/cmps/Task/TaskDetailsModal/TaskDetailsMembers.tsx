import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { UserAvatar } from "../../UserAvatar"
import { PlusOutlined } from "@ant-design/icons"
import { ManageMembersPopover } from "../ManageTaskPopovers/ManageMembersPopover"
import { ProfilePopover } from "../ManageTaskPopovers/ProfilePopover"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import { Member } from "../../../models/board.models"
import { editTask } from "../../../store/actions/board.actions"

interface TaskDetailsMembersProps {
    currentTask?: Task
}

export function TaskDetailsMembers({ currentTask }: TaskDetailsMembersProps) {
    const boardMembers = useSelector(
        (state: RootState) => state.boardModule.board?.members
    )
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([])

    useEffect(() => {
        if (boardMembers) {
            setSelectedMembers(
                boardMembers.filter((member) =>
                    currentTask?.idMembers.includes(member.id)
                )
            )
        }
    }, [currentTask, boardMembers])
    function onEditTask(memberId: string) {
        const newTaskMemberIds = currentTask ? [...currentTask.idMembers] : []

        newTaskMemberIds.splice(newTaskMemberIds.indexOf(memberId), 1)
        if (currentTask) {
            editTask({ ...currentTask, idMembers: newTaskMemberIds })
        }
    }

    return (
        <section className="task-details-members">
            <p className="sub-title">Members</p>
            <article className="members">
                {selectedMembers.map((member) => (
                    <ProfilePopover
                        memberId={member?.id}
                        key={member.id}
                        anchorEl={
                            <UserAvatar
                                memberId={member?.id}
                                size={32}
                                className="member"
                            />
                        }
                        anchorLinks={
                            <button
                                className="profile-remove"
                                onClick={() => onEditTask(member.id)}
                            >
                                Remove from card
                            </button>
                        }
                    />
                ))}
                <ManageMembersPopover
                    anchorEl={
                        <button className="add-members-btn">
                            <PlusOutlined />
                        </button>
                    }
                    task={currentTask}
                />
            </article>
        </section>
    )
}
