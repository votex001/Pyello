import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { BoardGroup } from "../cmps/Group/BoardGroup"
import {
    moveAllCards,
    archiveAllCards,
    dragGroup,
    updateBoard,
    moveTask,
} from "../store/board.actions"
import { loadWorkspaceUsers } from "../store/user.actions"
import { AddGroupBtn } from "../cmps/Group/AddGroupBtn"
import { TaskDetailsModal } from "../cmps/Task/TaskDetailsModal/TaskDetailsModal.jsx"
import { BoardHeader } from "../cmps/BoardHeader/BoardHeader.jsx"
import useScrollByGrab from "../customHooks/useScrollByGrab.js"
import { useParams, useOutletContext } from "react-router-dom"
import { useDocumentTitle } from "../customHooks/useDocumentTitle"

export function BoardIndex() {
    const [selectedTaskId, setSelectedTaskId] = useState(null)
    const [isDraggingOverId, setIsDraggingOverId] = useState(null)
    const board = useSelector((state) => state.boardModule.board)
    useDocumentTitle(`${board?.name} | Pyello`)
    const user = useSelector((state) => state.userModule.user)
    const outletProps = useOutletContext()
    const params = useParams()

    useEffect(() => {
        load()
    }, [params, user, board])
    useEffect(() => {
        if (board && board.members && board.activities) {
            const membersIds = board.members.map((u) => u.id)
            const activitiesIds = board.activities.map((a) => a?.userId)

            // Combine both arrays and make a Set to ensure uniqueness
            const uniqueIds = new Set([...membersIds, ...activitiesIds])

            // Convert the Set back to an array if needed
            loadWorkspaceUsers([...uniqueIds])
        }
    }, [board])

    async function load() {
        setTimeout(async () => {
            if (params.link && user && board) {
                if (
                    board.invLink !== "" &&
                    params.link === board.invLink &&
                    !board.members.some((m) => m.id === user.id)
                ) {
                    await updateBoard({
                        ...board,
                        members: [
                            {
                                id: user.id,
                                permissionStatus: "member",
                                fullName: user.fullName,
                            },
                            ...board.members,
                        ],
                    })
                } else {
                    history.replaceState(null, "", `/b/${board.id}`)
                }
            }
        }, 200)

        if (params.cardId) {
            setSelectedTaskId(params.cardId)
        }
    }

    const { scrollContainerRef, handlers } = useScrollByGrab()

    function onDragStart(result) {
        setIsDraggingOverId(null)
        if (result?.source?.droppableId !== "board") {
            setIsDraggingOverId(result?.source?.droppableId)
        }
    }

    function onDragUpdate(result) {
        if (result?.destination?.droppableId !== "board") {
            setIsDraggingOverId(result?.destination?.droppableId)
        }
    }

    async function onDragEnd(result) {
        setIsDraggingOverId(null)
        const { destination, source, draggableId, type } = result
        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        if (type === "group") {
            const dragGroupEvent = {
                boardId: board.id,
                groupId: draggableId,
                sourceIndex: source.index,
                destinationIndex: destination.index,
            }
            await dragGroup(dragGroupEvent, board)
        } else if (type === "task") {
            const dragTaskEvent = {
                boardId: board.id,
                sourceGroupId: source.droppableId,
                destinationGroupId: destination.droppableId,
                taskId: draggableId,
                sourceIndex: source.index,
                destinationIndex: destination.index,
            }

            await moveTask(dragTaskEvent, board, user)
        }
    }

    return board.id ? (
        <section className="board-index">
            <div className="bg">
                {board && (
                    <BoardHeader
                        setOpenBoardMenu={outletProps?.setOpenBoardMenu}
                        openBoardMenu={outletProps?.openBoardMenu}
                        starredBoardIds={user?.starredBoardIds}
                        showBtn={outletProps?.showBtn}
                        setShowBtn={outletProps?.setShowBtn}
                    />
                )}
                <DragDropContext
                    onDragStart={onDragStart}
                    onDragUpdate={onDragUpdate}
                    onDragEnd={onDragEnd}
                >
                    <Droppable
                        droppableId="board"
                        direction="horizontal"
                        type="group"
                        className="droppable-board"
                    >
                        {(provided) => (
                            <main
                                className="board-groups"
                                ref={(el) => {
                                    provided.innerRef(el)
                                    scrollContainerRef.current = el
                                }}
                                {...provided.droppableProps}
                                {...handlers}
                            >
                                {board.groups
                                    .filter((g) => !g.closed)
                                    .map((group) => (
                                        <BoardGroup
                                            key={group.id}
                                            group={group}
                                            moveAllCards={moveAllCards}
                                            archiveAllCards={archiveAllCards}
                                            isDraggingOverId={isDraggingOverId}
                                        />
                                    ))}
                                {provided.placeholder}
                                <AddGroupBtn />
                            </main>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {selectedTaskId && (
                <TaskDetailsModal
                    taskId={selectedTaskId}
                    onCloseTask={() => setSelectedTaskId(null)}
                    board={board}
                    closeTask={() => setSelectedTaskId(null)}
                />
            )}
        </section>
    ) : (
        <h1>Loading...</h1>
    )
}
