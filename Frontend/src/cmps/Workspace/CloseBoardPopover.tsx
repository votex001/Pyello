import { Popover, Button } from "antd"
import { useState } from "react"
import { ManageTaskPopoverHeader } from "../Task/ManageTaskPopovers/ManageTaskPopoverHeader"
import { EllipsisOutlined } from "@ant-design/icons"
import { ReactSVG } from "react-svg"

interface CloseBoardPopoverProps {
    boardName: string
    boardId: string
    onSelectBoardOptions: (s: string) => void
    closeBoard: (s: string) => void
    leaveBoard: (s: string) => void
}

export function CloseBoardPopover({
    boardName,
    boardId,
    onSelectBoardOptions,
    closeBoard,
    leaveBoard,
}: CloseBoardPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [action, setAction] = useState('')
    const [backToList, setBackToList] = useState<(() => void) | null>(null)

    function onClose(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        setIsOpen(false)
        setAction('')
    }

    function onNextPage() {
        setBackToList(() => onBackToList)
    }

    function onBackToList() {
        setAction('')
        setBackToList(null)
    }

    function onOpenPopover(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        setIsOpen(true)
        onSelectBoardOptions(boardId)
    }

    function onCloseBoard(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        closeBoard(boardId)
        setIsOpen(false)
    }

    function onLeaveBoard(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        leaveBoard(boardId)
        setIsOpen(false)
    }
    return (
        <Popover
            className="close-board-popover"
            trigger="click"
            placement="bottomRight"
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="close-board-popover-content">
                    <ManageTaskPopoverHeader
                        title={
                            action === "Close board" ? "Close board" : boardName
                        }
                        close={onClose}
                        back={backToList}
                    />

                    {action === null && (
                        <section className="popover-body">
                            <article
                                className="archive-option"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setAction("Close board")
                                    onSelectBoardOptions(boardId)
                                    onNextPage()
                                }}
                            >
                                <p>Close board</p>{" "}
                                <ReactSVG src="/img/workspace/more.svg" />
                            </article>
                            <article
                                className="archive-option"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setAction("Leave board?")
                                    onSelectBoardOptions(boardId)
                                    onNextPage()
                                }}
                            >
                                <p>Leave board</p>{" "}
                                <ReactSVG src="/img/workspace/more.svg" />
                            </article>
                        </section>
                    )}
                    {action === "Close board" && (
                        <section className="close-board-popover-body">
                            <p className="body-text">
                                You can find and reopen closed boards at the
                                bottom of your boards page.
                            </p>
                            <Button
                                className="close-btn"
                                size="small"
                                onClick={onCloseBoard}
                            >
                                Close
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
                </section>
            }
        >
            <Button className="more-btn" size="small" onClick={onOpenPopover}>
                <EllipsisOutlined />
            </Button>
        </Popover>
    )
}
