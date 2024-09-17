import { Input, InputRef } from "antd"
import { ManageTaskPopoverHeader } from "./ManageTaskPopoverHeader"
import { useState, useRef } from "react"
import { Tooltip } from "antd"
import CloudinaryUpload, { cloudinaryAttachment } from "../../CloudinaryUpload"
import { utilService } from "../../../services/util.service"
import dayjs from "dayjs"
import { showSuccessMsg } from "../../../services/event-bus.service"
import { useSelector } from "react-redux"
import Popup, { TriggerProps } from "@atlaskit/popup"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import { AddAttachmentActivity } from "../../../models/activities.models"
import { editTask } from "../../../store/actions/board.actions"

interface ManageAttachmentsPopoverProps {
    anchorEl: React.ReactNode
    task?: Task
}

export function ManageAttachmentsPopover({
    anchorEl,
    task,
}: ManageAttachmentsPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    function onClose() {
        setIsOpen(false)
    }

    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: TriggerProps) => {
        return (
            <label
                {...triggerProps}
                // isSelected={isOpen}
                onClick={onTriggerClick}
            >
                {anchorEl}
            </label>
        )
    }

    return (
        <Popup
            id="manage-attachments-popover-popup"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => (
                <ManageAttachmentsPopoverContent
                    task={task}
                    onClose={onClose}
                />
            )}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
interface ManageAttachmentsPopoverContentProps {
    task?: Task
    onClose: () => void
}

function ManageAttachmentsPopoverContent({
    task,
    onClose,
}: ManageAttachmentsPopoverContentProps) {
    const [link, setLink] = useState("")
    const [text, setText] = useState("")
    const [invalidLink, setInvalidLink] = useState(false)
    const [focusedLink, setFocusedLink] = useState(false)
    const [focusedText, setFocusedText] = useState(false)
    const user = useSelector((state: RootState) => state.userModule.user)
    const linkRef = useRef<InputRef | null>(null)
    const textRef = useRef<InputRef>(null)

    // ... rest

    const makeCover =
        !task?.cover.attachment &&
        !task?.cover.color &&
        task?.attachments.length === 0

    async function onAddLink() {
        if (link === "" || !utilService.isValidUrl(link)) {
            setInvalidLink(true)
            return
        }

        // TODO: get attachment name form server
        const attachment = {
            id: utilService.makeId(),
            link,
            text: text || link,
            createdAt: dayjs().toISOString(),
            type: "link",
        }

        if (task && !Array.isArray(task.attachments)) {
            task.attachments = []
        }
        if (user && task) {
            const newActivity = utilService.createActivity(
                {
                    type: "addAttachment",
                    targetId: task.id,
                    targetName: task.name,
                    attachmentLink: attachment.link,
                    attachmentName: attachment.text,
                },
                user
            ) as AddAttachmentActivity

            editTask(
                {
                    ...task,
                    attachments: [...task.attachments, attachment],
                },
                newActivity
            )
        }
        setLink("")
        setText("")
        onClose()
    }
    function onClearLink() {
        setLink("")
        linkRef.current?.focus()
    }

    function onClearText() {
        setText("")
        textRef.current?.focus()
    }

    async function onAddAttachment(data: cloudinaryAttachment) {
        const avgBgColor = await utilService.getAverageBorderColor(
            data.secure_url,
            10
        )

        const isDark = avgBgColor.isDark

        const attachment = {
            id: utilService.makeId(),
            link: data.secure_url,
            text: `${data.original_filename}.${data.format}`,
            format: data.format,
            createdAt: dayjs().toISOString(),
            type: data.resource_type,
            avgBgColor,
            isDark,
        }

        if (task && !Array.isArray(task.attachments)) {
            task.attachments = []
        }
        if (task && user) {
            const newActivity = utilService.createActivity(
                {
                    type: "addAttachment",
                    targetId: task.id,
                    targetName: task.name,
                    attachmentLink: attachment.link,
                    attachmentName: attachment.text,
                },
                user
            ) as AddAttachmentActivity

            const newTask = {
                ...task,
                attachments: [...task.attachments, attachment],
            }
            if (makeCover) {
                newTask.cover = {
                    ...task.cover,
                    attachment: attachment,
                    color: null,
                    size: "normal",
                }
            }
            editTask(newTask, newActivity)
        }
        onClose()
        showSuccessMsg("Success")
    }

    return (
        <section className="manage-attachments-popover-content">
            <ManageTaskPopoverHeader
                title="Attachments"
                close={onClose}
                // onSave={onSave}
            />
            <main className="main">
                <label className="section-title">
                    Attach a file from your computer
                </label>
                <label className="section-subtitle">
                    You can also drag and drop files to upload them.
                </label>
                <CloudinaryUpload
                    onAttachUrl={onAddAttachment}
                    anchorEl={
                        <button className="btn upload-button">Upload</button>
                    }
                />

                <hr className="divider" />
                <label className="section-title">Search or paste a link</label>
                <div className="input-wrapper">
                    <Input
                        type="text"
                        className={`input ${invalidLink && "invalid"} ${
                            focusedLink && "focused"
                        }`}
                        placeholder="Find recent links or past a new link"
                        suffix={
                            <ClearLinkIcon
                                onClick={onClearLink}
                                display={link !== ""}
                            />
                        }
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value || "")
                            setInvalidLink(false)
                        }}
                        onFocus={() => setFocusedLink(true)}
                        onBlur={() => setFocusedLink(false)}
                        ref={linkRef}
                    />
                    {invalidLink && (
                        <label className="invalid-link-message">
                            <ErrorIcon />
                            Enter a valid URL.
                        </label>
                    )}
                </div>
                <label className="section-title">Display text (optional)</label>
                <div className="input-wrapper">
                    <Input
                        type="text"
                        className={`input ${focusedText && "focused"}`}
                        placeholder="Text to display"
                        suffix={
                            <ClearLinkIcon
                                onClick={onClearText}
                                display={text !== ""}
                            />
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value || "")}
                        onFocus={() => setFocusedText(true)}
                        onBlur={() => setFocusedText(false)}
                        ref={textRef}
                    />
                </div>
                {/* <label className="section-title">Recently viewed</label> */}
                {/* TODO: Add recently viewed */}
                {/* <article className="recently-viewed"></article> */}
                <footer className="footer">
                    <button className="btn cancel">Cancel</button>
                    <button className="btn insert" onClick={onAddLink}>
                        Insert
                    </button>
                </footer>
            </main>
        </section>
    )
}
interface ClearLinkIconProps {
    display: boolean
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const ClearLinkIcon = ({ display, onClick }: ClearLinkIconProps) => {
    return (
        <Tooltip
            title="Clear link"
            arrow={false}
            placement="bottom"
            overlayInnerStyle={utilService.tooltipOuterStyle()}
        >
            <div
                className="close-icon-wrapper"
                style={{
                    background: "44546f",
                    padding: "4px",
                    display: display ? "flex" : "none",
                }}
                onClick={onClick}
            >
                <label className="pyello-icon icon-close"></label>
            </div>
        </Tooltip>
    )
}

const ErrorIcon = () => {
    return (
        <label className="error-icon-wrapper">
            <label className="attachment-error-icon">
                <label className="attachment-error-icon-text">!</label>
            </label>
        </label>
    )
}
