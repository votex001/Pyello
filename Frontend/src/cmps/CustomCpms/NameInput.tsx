import TextArea, { TextAreaRef } from "antd/es/input/TextArea"
import { useEffect, useRef, useState } from "react"
import { useClickOutside } from "../../customHooks/useClickOutside"
import { useEffectUpdate } from "../../customHooks/useEffectUpdate"
import { CloseOutlined } from "@ant-design/icons"
import { EmojiPopover } from "../Task/ManageTaskPopovers/EmojiPopover"

interface NameInputProps {
    onPressEnter?: (newName: string) => void
    value?: string
    placeholder?: string
    onSubmit?: (newName: string) => void
    expandInputWidth?: boolean
    maxRows?: number
    minRows?: number
    className?: string
    inputStatus?: (isChangeable: boolean) => void
    onChange?: (value: string) => void
    inputIsOpen?: boolean
    autoSelect?: boolean
    maxLength?: number
    withButtons?: boolean
    addButtons?: React.ReactNode[]
    emojiButton?: boolean
    onCloseInput?: () => void
    cancelBtnName?: string
    [key: string]: any // to handle any additional props
}

export function NameInput({
    onPressEnter,
    value = "",
    placeholder = "",
    onSubmit,
    expandInputWidth = true,
    maxRows,
    minRows,
    className,
    inputStatus,
    onChange,
    inputIsOpen = false,
    autoSelect = true,
    maxLength,
    withButtons = false,
    addButtons = [],
    emojiButton = false,
    onCloseInput,
    cancelBtnName,
    ...other
}: NameInputProps) {
    const [sectionRef, isChangeable, setIsChangeable] = useClickOutside(false)
    const [newName, setNewName] = useState<string>(value)
    const [customWidth, setCustomWidth] = useState<number | null>(null)
    const textAreaRef = useRef<TextAreaRef>(null)
    const spanRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        if (inputIsOpen) {
            setIsChangeable(true)
        } else {
            setIsChangeable(false)
        }
    }, [inputIsOpen])

    useEffectUpdate(() => {
        if (!isChangeable && newName !== value && !withButtons) {
            onRename()
        }
        if (inputStatus) {
            inputStatus(isChangeable)
        }
    }, [isChangeable])

    useEffect(() => {
        setNewName(value)

        if (textAreaRef.current && textAreaRef.current.resizableTextArea) {
            const textAreaElement =
                textAreaRef.current.resizableTextArea.textArea
            textAreaElement.focus()
            if (autoSelect) {
                textAreaElement.setSelectionRange(
                    0,
                    textAreaElement.value.length
                ) // Select all text
            } else {
                textAreaElement.setSelectionRange(
                    textAreaElement.value.length,
                    textAreaElement.value.length
                )
            }
        }
    }, [isChangeable, value])

    useEffect(() => {
        if (spanRef.current && expandInputWidth) {
            const currentWidth = spanRef.current.offsetWidth
            setCustomWidth(currentWidth + 6)
        }
    }, [value, newName, isChangeable])

    async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !onPressEnter) {
            e.preventDefault()
            onRename()
        } else if (e.key === "Enter" && onPressEnter) {
            e.preventDefault()
            onPressEnter(newName)
            setNewName(value)
        } else if (e.key === "Escape") {
            setNewName(value)
            setIsChangeable(false)
        }
    }

    function onRename() {
        setIsChangeable(false)
        if (newName === value || newName.trim() === "") {
            return
        }
        if (onSubmit) {
            onSubmit(newName)
        }
    }

    function onChangeName(value: string) {
        setNewName(value)
        if (onChange) {
            onChange(value)
        }
    }

    function addEmojy(emojy: string) {
        setNewName((prev) => prev + emojy)
    }

    function closeInput() {
        if (onCloseInput) {
            onCloseInput()
        }
        setIsChangeable(false)
    }

    return (
        <section
            className={`name-input ${className ? className : ""}`}
            {...other}
            ref={!withButtons ? sectionRef : null}
        >
            {isChangeable ? (
                <>
                    {expandInputWidth && (
                        <span className="title-input" ref={spanRef}>
                            {newName}
                        </span>
                    )}
                    <TextArea
                        ref={textAreaRef}
                        className="title-input"
                        autoSize={{ minRows: minRows, maxRows: maxRows }}
                        value={newName}
                        onChange={(e) => onChangeName(e.target.value)}
                        onKeyDown={onKeyDown}
                        style={
                            expandInputWidth
                                ? { width: customWidth + "px" }
                                : {}
                        }
                        maxLength={maxLength}
                        placeholder={placeholder}
                    />
                    {(withButtons || addButtons.length > 0 || emojiButton) && (
                        <section className="name-input-buttons">
                            {withButtons && (
                                <span className="right-buttons">
                                    <button
                                        className="btn btn-action"
                                        type="button"
                                        onClick={onRename}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={closeInput}
                                    >
                                        {cancelBtnName ? (
                                            cancelBtnName
                                        ) : (
                                            <CloseOutlined />
                                        )}
                                    </button>
                                </span>
                            )}
                            {(addButtons.length > 0 || emojiButton) && (
                                <span className="left-buttons">
                                    {emojiButton && (
                                        <EmojiPopover
                                            onAddEmojy={addEmojy}
                                            anchorEl={
                                                <button className="btn btn-secondary">
                                                    😀
                                                </button>
                                            }
                                        />
                                    )}
                                    {addButtons}
                                </span>
                            )}
                        </section>
                    )}
                </>
            ) : (
                <p className="title" onClick={() => setIsChangeable(true)}>
                    {value}
                </p>
            )}
        </section>
    )
}
