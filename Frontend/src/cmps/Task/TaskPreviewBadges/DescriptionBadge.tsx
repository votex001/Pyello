import { Tooltip } from "antd"
import { ReactSVG } from "react-svg"
import { utilService } from "../../../services/util.service"

interface DescriptionBadgeProps {
    desc?: string
}

export function DescriptionBadge({ desc }: DescriptionBadgeProps) {
    return utilService.isNotEmpty(desc) ? (
        <Tooltip
            placement="bottom"
            title="This card has a description"
            key="description"
            arrow={false}
            overlayInnerStyle={utilService.tooltipOuterStyle()}
        >
            <span className="task-icon-wrapper">
                <ReactSVG
                    src="/img/taskBadges/description.svg"
                    className="task-icon"
                    wrapper="span"
                />
            </span>
        </Tooltip>
    ) : (
        <></>
    )
}
