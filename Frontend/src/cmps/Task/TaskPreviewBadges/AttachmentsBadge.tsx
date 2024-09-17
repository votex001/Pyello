import { Tooltip } from "antd"
import { ReactSVG } from "react-svg"
import { utilService } from "../../../services/util.service"

interface AttachmentsBadgeProps {
    numOfAttachments?: number
}

export function AttachmentsBadge({
    numOfAttachments = 0,
}: AttachmentsBadgeProps) {
    return numOfAttachments > 0 ? (
        <Tooltip
            placement="bottom"
            title="Attachments"
            key="attachments"
            arrow={false}
            overlayInnerStyle={utilService.tooltipOuterStyle()}
        >
            <span className="task-icon-wrapper">
                <ReactSVG
                    src="/img/taskBadges/file.svg"
                    className="task-icon"
                    wrapper="span"
                />
                <span className="task-icon-count">{numOfAttachments}</span>
            </span>
        </Tooltip>
    ) : (
        <></>
    )
}
