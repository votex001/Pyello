import { useState, useEffect, useRef } from "react"
import { ReactSVG } from "react-svg"
import Popup from "@atlaskit/popup"

interface Option {
    name?: string
    id: string
    isCurrent: boolean
    element?: React.ReactNode
}

interface CustomSelect {
    options?: Option[]
    onSelect?: (option: Option | any) => void
    value?: string | null
    disabled?: boolean
    optionsClassName?: string
}

export function CustomSelect({
    options = [],
    onSelect,
    value,
    disabled = false,
    optionsClassName = "",
}: CustomSelect) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Option | undefined>(
        options[0]
    )
    const [searchValue, setSearchValue] = useState("")
    const [filteredItems, setFilteredItems] = useState<Option[]>(options)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const triggerRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (onSelect) {
            onSelect(options.find((o) => o.id === value))
        }
    }, [value])

    //when opens modal input focus
    useEffect(() => {
        if (isOpen && !disabled && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen, inputRef])

    useEffect(() => {
        setFilteredItems(options)
        if (options.length > 0) {
            setSelectedItem(options[0])
        }

        if (value) {
            const foundOption = options.find((o) => o.id === value)
            if (foundOption) {
                setSelectedItem(foundOption)
            }
        }
    }, [options])

    function onInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value)
    }

    function onSelectOption(
        item: Option,
        e: React.MouseEvent<HTMLButtonElement>
    ) {
        e.stopPropagation()
        setSelectedItem(item)
        if (onSelect) {
            onSelect(item)
        }
        setIsOpen(false)
    }

    const content = !disabled && options.length > 0 && (
        <div
            className={`custom-select-options ${optionsClassName}`}
            style={{ width: `${triggerRef.current?.clientWidth}px` }}
        >
            {filteredItems.map((item) => (
                <button
                    key={item?.id}
                    onClick={(e) => onSelectOption(item, e)}
                    className={`option ${
                        selectedItem?.name === item?.name ? "selected" : ""
                    } ${item.isCurrent ? "current" : ""}`}
                >
                    {item?.element || item?.name}
                </button>
            ))}
        </div>
    )

    const trigger = (triggerProps: React.HTMLProps<HTMLDivElement>) => (
        <div
            className="custom-select-item"
            onClick={() => (disabled ? null : setIsOpen(!isOpen))}
            ref={triggerRef}
            {...triggerProps}
        >
            <input
                className="custom-input"
                ref={inputRef}
                placeholder={selectedItem?.name}
                value={searchValue}
                onChange={onInput}
                disabled={disabled || options.length < 1}
            />

            <ReactSVG
                className="arrow-down"
                src="/img/workspace/backIcon.svg"
                wrapper="span"
            />
        </div>
    )

    return (
        <Popup
            id="manage-cover-popover-popup"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => content}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
