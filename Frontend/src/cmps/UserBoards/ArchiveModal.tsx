import { Modal } from "antd"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { utilService } from "../../services/util.service"
import { removeBoard, updateBoard } from "../../store/actions/board.actions"
import { RootState } from "../../store/store"
import { ReopenBoardActivity } from "../../models/activities.models"

interface ArchiveModalProps {
    onClose: () => void
}

export function ArchiveModal({ onClose }: ArchiveModalProps) {
    const boards = useSelector(
        (state: RootState) => state.workspaceModule.boards
    )
    const user = useSelector((state: RootState) => state.userModule.user)
    useEffect(() => {
        if (boards) {
            const closedBoardsCount = boards.filter((b) => b.closed).length
            if (closedBoardsCount === 0 && onClose) {
                onClose()
            }
        }
    }, [boards])

    function onDelete(boardId?: string) {
        if (boardId) {
            removeBoard(boardId)
        }
    }

    function onReopen(boardId?: string) {
        const board = boards?.find((b) => b.id === boardId)
        if (board && user) {
            const newActivity = utilService.createActivity(
                {
                    type: "reopenBoard",
                },
                user
            ) as ReopenBoardActivity
            updateBoard({
                ...board,
                closed: false,
                activities: [...(board?.activities || []), newActivity],
            })
        }
    }

    return (
        <Modal open onCancel={onClose} footer="">
            <section className="archive-module">
                <header className="module-header">
                    <h1>
                        <span className="pyello-icon icon-archive" /> Closed
                        boards
                    </h1>
                </header>
                <main className="module-main">
                    {boards
                        ?.filter((b) => b.closed)
                        .map((b) => {
                            return (
                                <section className="board" key={b.id}>
                                    <section className="board-info">
                                        <div
                                            style={{
                                                backgroundImage: `url(${b.prefs.backgroundImage})`,
                                            }}
                                            className="board-img"
                                        />
                                        <span className="board-name">
                                            {b.name}
                                        </span>
                                    </section>
                                    <section className="btns">
                                        <button
                                            className="btn reopen"
                                            disabled={
                                                !b.members.some(
                                                    (m) => m.id === user?.id
                                                ) && !user?.isAdmin
                                            }
                                            onClick={() => onReopen(b.id)}
                                        >
                                            Reopen
                                        </button>
                                        <button
                                            className="btn delete"
                                            disabled={
                                                !b.members.some(
                                                    (m) => m.id === user?.id
                                                ) && !user?.isAdmin
                                            }
                                            onClick={() => onDelete(b.id)}
                                        >
                                            <span className="pyello-icon icon-trash" />
                                            <span className="text">Delete</span>
                                        </button>
                                    </section>
                                </section>
                            )
                        })}
                </main>
            </section>
        </Modal>
    )
}
