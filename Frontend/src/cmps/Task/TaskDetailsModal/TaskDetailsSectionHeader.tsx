import { ReactSVG } from "react-svg"

interface TaskDetailsSectionHeaderProps {
    title?: string
    icon?: string
}

export function TaskDetailsSectionHeader({
    title,
    icon,
}: TaskDetailsSectionHeaderProps) {
    return (
        <header className="task-details-section-header">
            {icon && (
                <ReactSVG src={icon} wrapper="span" className="section-icon" />
            )}
            <h3 className="section-title">{title}</h3>
        </header>
    )
}
