import React, { useRef, useState, useEffect } from "react"
import { Modal, Input, ConfigProvider, InputRef } from "antd"
import cardIcon from "/img/taskActionBtns/cardIcon.svg"
import { TaskPreviewBadges } from "./TaskPreviewBadges"
import { TaskPreviewLabel } from "./TaskPreviewLabel"
import { utilService } from "../../services/util.service"
import moveIcon from "/img/taskActionBtns/moveIcon.svg"
import labelIcon from "/img/taskActionBtns/labelIcon.svg"
import userIcon from "/img/taskActionBtns/userIcon.svg"
import timeIcon from "/img/taskActionBtns/timeIcon.svg"
import coverIcon from "/img/taskActionBtns/coverIcon.svg"
import archiveIcon from "/img/taskActionBtns/archiveIcon.svg"
import { SvgButton } from "../CustomCpms/SvgButton"
import { ManageMembersPopover } from "./ManageTaskPopovers/ManageMembersPopover"
import { ManageLabelsPopover } from "./ManageTaskPopovers/ManageLabelsPopover"
import { ManageCoverPopover } from "./ManageTaskPopovers/ManageCoverPopover"
import { useSelector } from "react-redux"
import { MoveCardPopover } from "./ManageTaskPopovers/MoveCardPopover"
import { ManageDatesPopover } from "./ManageTaskPopovers/ManageDatesPopover"
import { useNavigate } from "react-router-dom"
import Popup from "@atlaskit/popup"
import { Task } from "../../models/task&groups.models"
import { RootState } from "../../store/store"
import { editTask } from "../../store/actions/board.actions"
import { Label } from "../../models/board.models"

interface TaskPreviewEditModalProps {
    task?: Task
    isHovered: boolean
    isOpen: boolean
    openPreviewModal: (b: boolean) => void
    taskWidth: number
    closePreviewModal: () => void
}

export function TaskPreviewEditModal({
    task,
    isHovered,
    isOpen,
    openPreviewModal,
    taskWidth,
    closePreviewModal,
}: TaskPreviewEditModalProps) {
    const boardLabels = useSelector(
        (state: RootState) => state.boardModule.board?.labels
    )
    const [taskLabels, setTaskLabels] = useState<Label[]>([])
    const [modalStyle, setModalStyle] = useState({})
    const [taskName, setTaskName] = useState(task?.name || "")
    const [removePopupButtons, setRemovePopupButtons] = useState(false)
    const [showEditModalBtn, setShowEditModalBtn] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<InputRef>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus({
                    cursor: "all",
                })
            }, 300)
        }
    }, [isOpen])

    useEffect(() => {
        setShowEditModalBtn(isHovered)
    }, [isHovered, isOpen])

    useEffect(() => {
        const taskLabels =
            boardLabels?.filter((boardLabel) =>
                task?.idLabels.includes(boardLabel.id)
            ) || []
        setTaskLabels(taskLabels)
    }, [task?.idLabels, boardLabels])

    useEffect(() => {
        setTaskName(task?.name || "")
    }, [task?.name])

    function showModal(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
            setModalStyle({
                position: "absolute",
                top: `${rect.top}px`,
                left: `${rect.right - taskWidth}px`,
                width: `${taskWidth}px`,
            })
        }
        openPreviewModal(true)
    }

    function handleOk(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        if (task && taskName !== task?.name) {
            editTask({ ...task, name: taskName })
        }
        openPreviewModal(false)
    }

    function handleCancel() {
        openPreviewModal(false)
    }

    function handleOpenCard() {
        closePreviewModal()
        navigate(`/c/${task?.id}`, { replace: true })
    }
    const modalActionButtons = [
        {
            cover: false,
            popover: (
                <SvgButton
                    src={cardIcon}
                    className="floating-button"
                    label="Open card"
                    onClick={handleOpenCard}
                />
            ),
        },
        {
            cover: false,
            popover: (
                <ManageLabelsPopover
                    anchorEl={
                        <SvgButton
                            src={labelIcon}
                            className="floating-button"
                            label="Edit labels"
                        />
                    }
                    task={task}
                />
            ),
        },
        {
            cover: false,
            popover: (
                <ManageMembersPopover
                    anchorEl={
                        <SvgButton
                            src={userIcon}
                            className="floating-button"
                            label="Change members"
                        />
                    }
                    task={task}
                />
            ),
        },
        {
            cover: true,
            popover: (
                <ManageCoverPopover
                    anchorEl={
                        <SvgButton
                            src={coverIcon}
                            className="floating-button"
                            label="Change cover"
                        />
                    }
                    task={task}
                />
            ),
        },
        {
            cover: false,
            popover: (
                <ManageDatesPopover
                    task={task}
                    anchorEl={
                        <SvgButton
                            src={timeIcon}
                            className="floating-button"
                            label="Edit date"
                        />
                    }
                />
            ),
        },
        {
            cover: true,
            popover: (
                <MoveCardPopover
                    task={task}
                    anchorEl={
                        <SvgButton
                            src={moveIcon}
                            label="Move"
                            className="floating-button"
                        />
                    }
                />
            ),
        },
        {
            popover: (
                <SvgButton
                    src={archiveIcon}
                    className="floating-button"
                    label="Archive"
                    onClick={() =>
                        task ? editTask({ ...task, closed: true }) : null
                    }
                />
            ),
            cover: true,
        },
    ]

    const content = () => {
        if (!isOpen) return null
        return (
            <div
                className={`task-preview-floating-buttons ${
                    removePopupButtons ? "remove-popup-buttons" : ""
                }`}
            >
                {modalActionButtons.map((btn, index) => (
                    <div
                        key={index}
                        style={{
                            display:
                                task?.cover.size === "normal" || btn.cover
                                    ? "block"
                                    : "none",
                        }}
                    >
                        {btn.popover}
                    </div>
                ))}
            </div>
        )
    }

    const trigger = () => {
        return (
            <div ref={triggerRef}>
                {task?.cover.color && (
                    <div
                        className="group-task-header normal-cover"
                        style={{
                            backgroundColor: utilService.getColorHashByName(
                                task?.cover.color
                            )?.bgColor,
                        }}
                    ></div>
                )}
                {task?.cover.attachment && (
                    <div
                        className="group-task-header img-cover"
                        style={{
                            backgroundImage: `url(${task?.cover.attachment?.link})`,
                        }}
                    ></div>
                )}
                <main className="task-preview-edit-modal-content">
                    <article className="preview-labels">
                        {taskLabels?.map((label) => (
                            <TaskPreviewLabel key={label.id} label={label} />
                        ))}
                    </article>
                    <Input
                        ref={textareaRef}
                        className="task-name-input"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TaskPreviewBadges task={task} />
                </main>
                <button
                    className="floating-button save-button"
                    onClick={handleOk}
                >
                    Save
                </button>
                <section
                    className={`floating-buttons ${
                        task?.cover.size === "full" ? "full-cover" : ""
                    }`}
                ></section>
            </div>
        )
    }

    return (
        <div>
            {showEditModalBtn && (
                <div
                    ref={containerRef}
                    className="task-preview-edit-modal-anchor"
                >
                    <button className="preview-anchor-btn" onClick={showModal}>
                        <label className="pyello-icon icon-edit"></label>
                    </button>
                </div>
            )}
            <ConfigProvider
                getPopupContainer={() => triggerRef.current || document.body}
            >
                <Modal
                    className="task-preview-edit-modal"
                    open={isOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    getContainer={() => {
                        return containerRef.current ?? document.body
                    }}
                    style={modalStyle}
                    width={taskWidth}
                    closable={false}
                    footer={null}
                    transitionName="" // Disable modal open animation
                    maskTransitionName=""
                    // Disable the full-screen mask
                >
                    <Popup
                        id="task-preview-edit-modal-popup"
                        isOpen={isOpen}
                        placement="right-start"
                        fallbackPlacements={["right", "left-start", "left"]}
                        content={content}
                        trigger={(triggerProps) => (
                            <div {...triggerProps}>{trigger()}</div>
                        )}
                        zIndex={9000}
                    />
                </Modal>
            </ConfigProvider>
        </div>
    )
}
