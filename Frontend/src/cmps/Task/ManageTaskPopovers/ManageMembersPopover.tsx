import { Input } from "antd"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { MemberOption } from "./MemberOption"
import { ManageTaskPopoverHeader } from "./ManageTaskPopoverHeader"
import Popup, { TriggerProps } from "@atlaskit/popup"
import { RootState } from "../../../store/store"
import { Task } from "../../../models/task&groups.models"
import { User } from "../../../models/user.model"

interface ManageMembersPopoverProps {
    anchorEl: React.ReactNode
    task: Task
}

export function ManageMembersPopover({
    anchorEl,
    task,
}: ManageMembersPopoverProps) {
    const workspaceUsers = useSelector(
        (state: RootState) => state.userModule.users
    )
    const membersIds = useSelector(
        (state: RootState) => state.boardModule.board?.members
    )
    const members = workspaceUsers?.filter((user) =>
        membersIds?.some((member) => member.id === user.id)
    )
    const [inputSearch, setInputSearch] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedMembers, setSelectedMembers] = useState<User[]>([])
    const [unselectedMembers, setUnselectedMembers] = useState<User[]>([])

    useEffect(() => {
        if (inputSearch === "" && members && task) {
            setSelectedMembers(
                members.filter((member) => task?.idMembers.includes(member?.id))
            )
            setUnselectedMembers(
                members.filter(
                    (member) => !task?.idMembers.includes(member?.id)
                )
            )
        } else if (members) {
            setSelectedMembers(
                members
                    ?.filter((member) => task?.idMembers.includes(member?.id))
                    .filter((member) =>
                        member?.fullName
                            .toLowerCase()
                            .includes(inputSearch.toLowerCase())
                    )
            )
            setUnselectedMembers(
                members
                    .filter((member) => !task?.idMembers.includes(member?.id))
                    .filter((member) =>
                        member?.fullName
                            .toLowerCase()
                            .includes(inputSearch.toLowerCase())
                    )
            )
        }
    }, [task?.idMembers, inputSearch])

    function onClose() {
        setIsOpen(false)
    }

    const content = (
        <section className="change-members-popover">
            <ManageTaskPopoverHeader title="Add members" close={onClose} />
            <article className="change-members-content">
                <Input
                    placeholder="Search members"
                    className="members-search-input"
                    value={inputSearch}
                    onChange={(e) => setInputSearch(e.target.value)}
                />
                {selectedMembers.length > 0 && (
                    <article className="selected-task-members">
                        <h3 className="members-sub-title">Card members</h3>
                        {selectedMembers.map((member, index) => (
                            <MemberOption
                                key={index}
                                task={task}
                                member={member}
                                isSelected={true}
                            />
                        ))}
                    </article>
                )}
                {unselectedMembers.length > 0 && (
                    <article className="unselected-members-list">
                        <h3 className="members-sub-title">Board members</h3>
                        {unselectedMembers.map((member, index) => (
                            <MemberOption
                                key={index}
                                task={task}
                                member={member}
                                isSelected={false}
                            />
                        ))}
                    </article>
                )}
                {unselectedMembers.length === 0 &&
                    selectedMembers.length === 0 && (
                        <article className="no-members-found">
                            No results
                        </article>
                    )}
            </article>
        </section>
    )
    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: TriggerProps) => {
        return (
            <label
                {...triggerProps}
                // isSelected={isOpen}
                onClick={onTriggerClick}
            >
                {anchorEl}
            </label>
        )
    }

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => content}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
