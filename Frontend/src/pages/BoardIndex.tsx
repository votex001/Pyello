import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { BoardGroup } from "../cmps/Group/BoardGroup"
import {
    addGroup,
    dragGroup,
    updateBoard,
    moveTask,
} from "../store/actions/board.actions"
import { editUser, loadWorkspaceUsers } from "../store/actions/user.actions"

import { AddGroupBtn } from "../cmps/Group/AddGroupBtn"
import { TaskDetailsModal } from "../cmps/Task/TaskDetailsModal/TaskDetailsModal"
import { BoardHeader } from "../cmps/BoardHeader/BoardHeader"
import useScrollByGrab from "../customHooks/useScrollByGrab"
import { useParams, useOutletContext } from "react-router-dom"
import { useDocumentTitle } from "../customHooks/useDocumentTitle"
import { RootState } from "../store/store"

export function BoardIndex() {
    const [selectedTaskId, setSelectedTaskId] = useState("")
    const [isDraggingOverId, setIsDraggingOverId] = useState(null)
    const board = useSelector((state: RootState) => state.boardModule.board)
    useDocumentTitle(`${board?.name} | Pyello`)
    const user = useSelector((state: RootState) => state.userModule.user)
    const outletProps: {
        setOpenBoardMenu?: React.Dispatch<React.SetStateAction<boolean>>
        openBoardMenu?: boolean
        showBtn?: boolean
        setShowBtn?: React.Dispatch<React.SetStateAction<boolean>>
    } = useOutletContext()
    const params = useParams()

    useEffect(() => {
        load()
    }, [params, user, board])
    useEffect(() => {
        if (board && board.members && board.activities) {
            const membersIds = board.members.map((u) => u.id)
            const activitiesIds = board.activities.map((a) => a.userId)

            // Combine both arrays and make a Set to ensure uniqueness
            const uniqueIds = new Set([...membersIds, ...activitiesIds])

            // Convert the Set back to an array if needed
            loadUsers([...uniqueIds])
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

    async function loadUsers(membersIds: string[]) {
        await loadWorkspaceUsers(membersIds)
    }

    const { scrollContainerRef, handlers } = useScrollByGrab()

    async function onAddGroup(name: string) {
        if (!board || !user) return
        const group = {
            name: name,
            idBoard: board?.id!,
            pos: board.groups.length,
        }
        await addGroup(group, board.id!, user)
    }

    function onStarToggle(starredIds: string[]) {
        if (!user) return
        editUser({ ...user, starredBoardIds: starredIds })
    }

    function onDragStart(result: any) {
        setIsDraggingOverId(null)
        if (result?.source?.droppableId !== "board") {
            setIsDraggingOverId(result?.source?.droppableId)
        }
    }

    function onDragUpdate(result: any) {
        if (result?.destination?.droppableId !== "board") {
            setIsDraggingOverId(result?.destination?.droppableId)
        }
    }

    async function onDragEnd(result: any) {
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

        if (!board) return
        if (type === "group") {
            const dragGroupEvent = {
                boardId: board.id,
                groupId: draggableId,
                sourceIndex: source.index,
                destinationIndex: destination.index,
            }
            await dragGroup(dragGroupEvent, board)
        } else if (type === "task") {
            if (!user) return
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
    return board ? (
        <section className="board-index">
            <div className="bg">
                {board && (
                    <BoardHeader
                        setOpenBoardMenu={outletProps?.setOpenBoardMenu}
                        openBoardMenu={outletProps?.openBoardMenu}
                        starToggle={onStarToggle}
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
                    >
                        {(provided) => (
                            <main
                                className="board-groups"
                                ref={(el) => {
                                    provided.innerRef(el)
                                    if (el instanceof HTMLDivElement) {
                                        scrollContainerRef.current = el
                                    }
                                }}
                                {...provided.droppableProps}
                                onMouseDown={(
                                    e: React.MouseEvent<HTMLElement>
                                ) => {
                                    // Handle mouse down
                                    handlers.onMouseDown(e.nativeEvent)
                                }}
                                onMouseMove={(
                                    e: React.MouseEvent<HTMLElement>
                                ) => {
                                    // Handle mouse move
                                    handlers.onMouseMove(e.nativeEvent)
                                }}
                                onMouseLeave={() => {
                                    // Handle mouse leave
                                    handlers.onMouseLeave()
                                }}
                                onMouseUp={() => {
                                    // Handle mouse up
                                    handlers.onMouseUp()
                                }}
                                // Separate handler for drag events if needed
                                onDragOver={(
                                    e: React.DragEvent<HTMLElement>
                                ) => {
                                    e.preventDefault()
                                }}
                            >
                                {board.groups
                                    .filter((g) => !g.closed)
                                    .map((group) => (
                                        <BoardGroup
                                            key={group.id}
                                            group={group}
                                            isDraggingOverId={isDraggingOverId}
                                        />
                                    ))}
                                {provided.placeholder}
                                <AddGroupBtn addGroup={onAddGroup} />
                            </main>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {selectedTaskId && (
                <TaskDetailsModal
                    taskId={selectedTaskId}
                    onCloseTask={() => setSelectedTaskId("")}
                />
            )}
        </section>
    ) : (
        <h1>Loading...</h1>
    )
}
