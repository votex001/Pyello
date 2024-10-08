import { SvgButton } from "../../CustomCpms/SvgButton"

interface ManageTaskPopoverHeaderProps {
    title: string
    close: (e: React.MouseEvent<HTMLButtonElement>) => void
    back?: (() => void) | null
}

export function ManageTaskPopoverHeader({
    title,
    close,
    back,
}: ManageTaskPopoverHeaderProps) {
    return (
        <header className="manage-task-popover-header">
            {back && (
                <span className="back-button-wrapper">
                    <SvgButton
                        src="/img/taskActionBtns/arrowLeftIcon.svg"
                        className="back-button"
                        onClick={back}
                    />
                </span>
            )}
            {title}
            <span className="close-button-wrapper">
                <SvgButton
                    src="/img/xIcon.svg"
                    className="close-button"
                    onClick={close}
                />
            </span>
        </header>
    )
}
