import { Card } from "antd"
import { GroupFooter } from "./GroupFooter"
import { useState, useEffect, useRef } from "react"
import { AddTaskInGroup } from "./AddTaskInGroup"
import { BoardGroupHeader } from "./BoardGroupHeader"
import { TaskPreview } from "../Task/TaskPreview"
import { useClickOutside } from "../../customHooks/useClickOutside"
import { Droppable, Draggable } from "react-beautiful-dnd"
import useScrollPercentage from "../../customHooks/useScrollPercentage"
import { useSelector } from "react-redux"
import { Group, Task } from "../../models/task&groups.models"
import { RootState } from "../../store/store"
import { addTask } from "../../store/actions/board.actions"

interface BoardGroupProps {
    group?: Group
    isDraggingOverId: string | null
}

export function BoardGroup({ group, isDraggingOverId }: BoardGroupProps) {
    const [newTasksAboveInput, setNewTasksAboveInput] = useState<Task[]>([])
    const [sortedTasks, setSortedTasks] = useState<Task[]>([])
    const [isTopAddTaskOpen, setIsTopAddTaskOpen] = useState<boolean>(false)
    const [isBottomAddTaskOpen, setIsBottomAddTaskOpen] =
        useState<boolean>(false)
    const [containerRef, isAnyAddTaskOpen, setIsAnyAddTaskOpen] =
        useClickOutside(false)
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    const groupRef = useRef<HTMLElement | null>(null)
    const [_, setScrollToPercentage] = useScrollPercentage(groupRef)

    const [showPlaceholder, setShowPlaceholder] = useState<boolean>(false)
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false)

    useEffect(() => {
        if (isDraggingOverId === group?.id || isDraggingOverId === null) {
            setShowPlaceholder(true)
        } else {
            const timer = setTimeout(() => {
                setShowPlaceholder(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isDraggingOverId, group?.id])

    useEffect(() => {
        if (!isAnyAddTaskOpen) {
            setIsTopAddTaskOpen(false)
            setIsBottomAddTaskOpen(false)
        }
    }, [isAnyAddTaskOpen])

    //TODO cleanup
    useEffect(() => {
        const filteredTasks = group?.tasks?.filter((task) => !task.closed) || []
        const updatedTaskIds = filteredTasks.map((task) => task.id)
        const currentTaskIds = sortedTasks.map((task) => task?.id)
        const newTaskIds = updatedTaskIds.filter(
            (taskId) => !currentTaskIds.includes(taskId)
        )
        const newTasks = filteredTasks.filter((task) =>
            newTaskIds.includes(task.id)
        )
        if (isTopAddTaskOpen) {
            setNewTasksAboveInput(newTasks)
        } else {
            // setSortedTasks(filteredTasks.sort((a, b) => a.pos - b.pos) || []);
            setSortedTasks(filteredTasks || [])
            setNewTasksAboveInput([])
        }
    }, [group?.tasks.length, group?.updatedAt, isAnyAddTaskOpen])

    function addNewTask(
        task: {
            addToTop: boolean
            name: string
            groupId: string
        },
        group: Group
    ) {
        if (board && user) {
            const newTask = {
                ...task,
                idBoard: board.id!,
            }
            addTask(newTask, user, group, newTasksAboveInput.length, board)
        }
    }

    const openTopAddTask = () => {
        setIsTopAddTaskOpen(true)
        setIsAnyAddTaskOpen(true)
    }

    const onCloseTopAddTask = () => {
        setIsTopAddTaskOpen(false)
        setIsAnyAddTaskOpen(false)
        setNewTasksAboveInput([])
    }

    const openBottomAddTask = () => {
        setIsBottomAddTaskOpen(true)
        setIsAnyAddTaskOpen(true)
    }

    function onCloseBottomAddTask() {
        setIsBottomAddTaskOpen(false)
        setIsAnyAddTaskOpen(false)
    }

    function onAddTaskBtnClick() {
        openBottomAddTask()
        setTimeout(() => {
            setScrollToPercentage(200)
        }, 0)
    }

    function disableDnD(value: boolean) {
        setIsOpenPreviewModal(value)
    }
    if (!group) return <></>
    return (
        <Draggable draggableId={group.id} index={group.pos}>
            {(draggableProvided, snapshot) => (
                <div
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                    className={`${
                        !board?.members.some((m) => m.id === user?.id) &&
                        !user?.isAdmin
                            ? "disable"
                            : ""
                    }`}
                >
                    <div
                        className={`board-group-container ${
                            snapshot.isDragging ? "dragging" : ""
                        }`}
                    >
                        <Card
                            className={`board-group custom-card ${
                                isDraggingOverId === group.id ? "draggOver" : ""
                            }`}
                            ref={containerRef}
                        >
                            <BoardGroupHeader
                                draggableProvided={draggableProvided}
                                group={group}
                                openAddTask={openTopAddTask}
                            />
                            <Droppable droppableId={group.id} type="task">
                                {(droppableProvided, snapshot) => (
                                    <main
                                        className={`board-group-main ${
                                            snapshot.isDraggingOver
                                                ? "dragging-over"
                                                : ""
                                        } `}
                                        ref={(el) => {
                                            droppableProvided.innerRef(el)
                                            groupRef.current = el
                                        }}
                                        {...droppableProvided.droppableProps}
                                    >
                                        {newTasksAboveInput.map((task) => (
                                            <TaskPreview
                                                key={task.id}
                                                task={task}
                                                disableDnD={disableDnD}
                                            />
                                        ))}
                                        {isTopAddTaskOpen && (
                                            <AddTaskInGroup
                                                groupId={group.id}
                                                closeAddTask={onCloseTopAddTask}
                                                addTask={addNewTask}
                                                addToTop={true}
                                            />
                                        )}
                                        {group.tasks
                                            .sort((a, b) => a.pos - b.pos)
                                            .filter((task: Task) => {
                                                return !newTasksAboveInput.some(
                                                    (newTask) =>
                                                        newTask.id === task.id
                                                )
                                            })
                                            .filter((task) => !task.closed)
                                            .map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                    isDragDisabled={
                                                        isOpenPreviewModal
                                                    }
                                                >
                                                    {(
                                                        provided,
                                                        dragSnapshot
                                                    ) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`task-preview-container ${
                                                                dragSnapshot.isDragging
                                                                    ? "dragging"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <TaskPreview
                                                                key={task.id}
                                                                task={task}
                                                                isDragging={
                                                                    dragSnapshot.isDragging
                                                                }
                                                                disableDnD={
                                                                    disableDnD
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {isBottomAddTaskOpen && (
                                            <AddTaskInGroup
                                                groupId={group.id}
                                                closeAddTask={
                                                    onCloseBottomAddTask
                                                }
                                                addTask={addNewTask}
                                                addToTop={false}
                                                onBtnClick={onAddTaskBtnClick}
                                                groupRef={groupRef}
                                            />
                                        )}
                                        {showPlaceholder &&
                                            droppableProvided.placeholder}
                                    </main>
                                )}
                            </Droppable>
                            {!isTopAddTaskOpen && !isBottomAddTaskOpen && (
                                <GroupFooter
                                    groupRef={groupRef}
                                    openBottomAddTask={openBottomAddTask}
                                />
                            )}
                            {!isBottomAddTaskOpen && isTopAddTaskOpen && (
                                <div className="group-footer-placeholder"></div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
