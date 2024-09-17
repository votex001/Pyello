import React, { useState } from "react"
import Popup, { TriggerProps } from "@atlaskit/popup"
import { ManageTaskPopoverHeader } from "./ManageTaskPopoverHeader"

interface DeleteAttachmentPopoverProps {
    anchorEl: React.ReactNode
    popoverTitle: string
    onDelete: () => void
    isDelete: boolean
}

export function DeleteAttachmentPopover({
    anchorEl,
    popoverTitle,
    onDelete,
    isDelete,
}: DeleteAttachmentPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = () => {
        onDelete()
        setIsOpen(false)
    }

    const content = (
        <div
            className="delete-attachment-popover"
            onClick={(e) => e.stopPropagation()}
        >
            <ManageTaskPopoverHeader
                title={popoverTitle}
                close={() => setIsOpen(false)}
            />
            <section className="delete-label-page">
                <p>
                    {isDelete
                        ? "Deleting an attachment is permanent. There is no undo."
                        : "Remove this attachment? There is no undo."}
                </p>
                <button
                    className="delete-attachment-button"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </section>
        </div>
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
            id="delete-attachment-popover-popup"
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
