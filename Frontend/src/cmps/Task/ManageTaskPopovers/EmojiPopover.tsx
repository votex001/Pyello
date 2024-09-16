import Popup from "@atlaskit/popup"

import React, { useState } from "react"
import { utilService } from "../../../services/util.service"

interface EmojiPopoverProps {
    anchorEl: React.ReactNode
    onAddEmojy: (emoji: string) => void
}

export function EmojiPopover({ anchorEl, onAddEmojy }: EmojiPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    const content = (
        <section className="emojy-popover">
            {utilService.getEmojis().map((e) => (
                <button className="btn" key={e} onClick={() => onAddEmojy(e)}>
                    {e}
                </button>
            ))}
        </section>
    )
    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: React.HTMLProps<HTMLDivElement>) => {
        return (
            <div {...triggerProps} onClick={onTriggerClick}>
                {anchorEl}
            </div>
        )
    }

    return (
        <Popup
            id="emoji-popover-popup"
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
