import { Popover, Button } from "antd"
import { useState } from "react"
import { ManageTaskPopoverHeader } from "../../Task/ManageTaskPopovers/ManageTaskPopoverHeader"
import { TooltipPlacement } from "antd/es/tooltip"

interface ActionPopoverProps {
    deleteBoard?: () => void
    leaveBoard?: () => void
    anchorEl: React.ReactNode
    action: "Delete board?" | "Leave board?" | "Delete card?"
    deleteTask?: () => void
    position?: TooltipPlacement
}

export function ActionPopover({
    deleteBoard,
    leaveBoard,
    anchorEl,
    action,
    deleteTask,
    position = "bottomRight",
}: ActionPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    function onClose(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        setIsOpen(false)
    }

    function onDeleteBoard(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        if (deleteBoard) deleteBoard()
        setIsOpen(false)
    }
    function onDeleteTask(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        if (deleteTask) deleteTask()
        setIsOpen(false)
    }

    function onLeaveBoard(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation()
        if (leaveBoard) leaveBoard()
        setIsOpen(false)
    }
    return (
        <Popover
            className="close-board-popover"
            trigger="click"
            placement={position}
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="close-board-popover-content">
                    <ManageTaskPopoverHeader title={action} close={onClose} />

                    {action === "Delete board?" && (
                        <section className="close-board-popover-body">
                            <p className="body-text">
                                You can find and reopen closed boards at the
                                bottom of your boards page.
                            </p>
                            <Button
                                className="close-btn"
                                size="small"
                                onClick={onDeleteBoard}
                            >
                                Delete
                            </Button>
                        </section>
                    )}
                    {action === "Leave board?" && (
                        <section className="close-board-popover-body">
                            <p className="body-text">
                                You will be removed from all cards on this
                                board.
                            </p>
                            <Button
                                className="close-btn"
                                size="small"
                                onClick={onLeaveBoard}
                            >
                                Leave
                            </Button>
                        </section>
                    )}
                    {action === "Delete card?" && (
                        <section className="close-board-popover-body">
                            <p className="body-text">
                                You won’t be able to re-open the card. There is
                                no undo.
                            </p>
                            <Button
                                className="close-btn"
                                size="small"
                                onClick={onDeleteTask}
                            >
                                Delete
                            </Button>
                        </section>
                    )}
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
