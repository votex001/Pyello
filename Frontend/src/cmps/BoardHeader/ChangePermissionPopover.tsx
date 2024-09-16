import Popup, { TriggerProps } from "@atlaskit/popup"
import { useState } from "react"

interface ChangePermissionPopoverProps {
    anchorEl: React.ReactNode
    onChange: ({
        option,
        memberId,
    }: {
        option: "admin" | "member" | "kick"
        memberId: string
    }) => void
    memberId: string
    myOptions: boolean
    currenOption: "member" | "admin"
}

export function ChangePermissionPopover({
    anchorEl,
    onChange,
    memberId = "",
    myOptions,
    currenOption,
}: ChangePermissionPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: TriggerProps) => {
        return (
            <button
                className="permission-button"
                {...triggerProps}
                onClick={onTriggerClick}
            >
                {anchorEl}
            </button>
        )
    }

    function onChangeState(option: "admin" | "member" | "kick") {
        if (onChange) {
            onChange({ option, memberId })
        }
        setIsOpen(false)
    }

    return (
        <Popup
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-end"
            fallbackPlacements={["top-end", "auto"]}
            content={() => (
                <section className="permission-select">
                    {myOptions && (
                        <span className="warning">
                            Changing your role will remove admin privileges and
                            can only be undone by another admin.
                        </span>
                    )}
                    <div
                        className={`option ${
                            currenOption === "admin" ? "current" : ""
                        }`}
                        onClick={() => onChangeState("admin")}
                    >
                        Admin
                    </div>
                    <div
                        className={`option ${
                            currenOption === "member" ? "current" : ""
                        }`}
                        onClick={() => onChangeState("member")}
                    >
                        Member
                    </div>
                    <div
                        className={`option `}
                        onClick={() => onChangeState("kick")}
                    >
                        {myOptions ? "Leave" : "Remove from"} board
                    </div>
                </section>
            )}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
