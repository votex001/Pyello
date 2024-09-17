import { utilService } from "../../services/util.service"
import { useSelector } from "react-redux"
import { useState } from "react"
import { toggleIsExpanded } from "../../store/actions/board.actions"
import { Tooltip } from "antd"
import { Label } from "../../models/board.models"
import { RootState } from "../../store/store"

interface TaskPreviewLabelProps {
    label: Label
}

export function TaskPreviewLabel({ label }: TaskPreviewLabelProps) {
    const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null)
    const isExpanded = useSelector(
        (state: RootState) => state.boardModule.isExpanded
    )
    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        toggleIsExpanded()
    }
    return (
        <Tooltip
            placement="bottom"
            title={`Color: ${label.color}, title: ${
                label.name ? `"${label.name}"` : "none"
            }`}
            arrow={false}
            overlayInnerStyle={utilService.tooltipOuterStyle()}
        >
            <button
                className={`card-label ${
                    isExpanded ? "expanded" : "minimized"
                }`}
                style={{
                    backgroundColor:
                        hoveredLabelId === label.id
                            ? utilService.getColorHashByName(label.color)
                                  ?.hoveredBgColor
                            : utilService.getColorHashByName(label.color)
                                  ?.bgColor,
                    color: utilService.getColorHashByName(label.color)
                        ?.lightFontColor,
                }}
                onClick={onClick}
                onMouseEnter={() => setHoveredLabelId(label.id)}
                onMouseLeave={() => setHoveredLabelId(null)}
            >
                {isExpanded ? label.name : ""}
            </button>
        </Tooltip>
    )
}
