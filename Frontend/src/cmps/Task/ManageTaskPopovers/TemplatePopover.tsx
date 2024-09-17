import { Popover } from "antd"
import { useState } from "react"
import { ManageTaskPopoverHeader } from "./ManageTaskPopoverHeader"

interface TNAMEProps {
    anchorEl: React.ReactNode
}

export function TNAME({ anchorEl }: TNAMEProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [backToList, setBackToList] = useState<(() => void) | null>(null)

    const cardTitle = "ADD TITLE"

    function onClose() {
        setIsOpen(false)
    }

    function onNextPage() {
        //
        setBackToList(() => onBackToList)
    }

    function onBackToList() {
        //
        setBackToList(null)
    }

    return (
        <Popover
            className="manage-labels-popover"
            trigger="click"
            placement="bottomRight"
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="manage-labels-content">
                    <ManageTaskPopoverHeader
                        title="cardTitle"
                        close={onClose}
                        back={backToList}
                    />
                    {/* ADD BODY */}
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
