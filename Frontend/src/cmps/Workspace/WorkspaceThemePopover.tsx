import { Popover } from "antd"
import { useEffect, useState } from "react"
import themeLight from "/img/workspace/theme-light.svg"
import themeDark from "/img/workspace/theme-dark.svg"
import themeDefault from "/img/workspace/theme-default.svg"
import { useSelector } from "react-redux"
import { editUser } from "../../store/actions/user.actions"
import { RootState } from "../../store/store"

interface WorkspaceThemePopoverProps {
    anchorEl: React.ReactNode
    setDarkMode: (string: "light" | "dark" | "default") => void
    darkMode: "light" | "dark" | "default" | ""
}

export function WorkspaceThemePopover({
    anchorEl,
    setDarkMode,
    darkMode,
}: WorkspaceThemePopoverProps) {
    const user = useSelector((state: RootState) => state.userModule.user)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState("")

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value)
    }
    useEffect(() => {
        if (selectedOption) {
            if (selectedOption === "light") {
                if (!user) return
                editUser({ ...user, darkMode: "light" })
                setDarkMode("light")
            } else if (selectedOption === "dark") {
                if (!user) return
                editUser({ ...user, darkMode: "dark" })
                setDarkMode("dark")
            } else if (selectedOption === "default") {
                if (!user) return
                editUser({ ...user, darkMode: "default" })
                setDarkMode("default")
            }
        }
    }, [selectedOption])

    const btns = [
        <label
            className={`theme-switch ${darkMode === "light" ? "checked" : ""}`}
        >
            <input
                className="theme-radio"
                type="radio"
                value="light"
                onChange={handleRadioChange}
                checked={darkMode === "light"}
            />
            <span className="theme">
                <img src={themeLight} />
                <span>Light</span>
            </span>
        </label>,
        <label
            className={`theme-switch ${darkMode === "dark" ? "checked" : ""}`}
        >
            <input
                className="theme-radio"
                type="radio"
                value="dark"
                onChange={handleRadioChange}
                checked={darkMode === "dark"}
            />
            <span className="theme">
                <img src={themeDark} />
                <span>Dark</span>
            </span>
        </label>,
        <label
            className={`theme-switch ${
                darkMode === "default" ? "checked" : ""
            }`}
        >
            <input
                className="theme-radio"
                type="radio"
                value="default"
                onChange={handleRadioChange}
                checked={darkMode === "default"}
            />
            <span className="theme">
                <img src={themeDefault} />
                <span>Match browser</span>
            </span>
        </label>,
    ]

    return (
        <Popover
            className={`${isOpen ? "active" : ""}`}
            trigger="click"
            placement="leftTop"
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="manage-theme-popover">
                    {btns.map((b, idx) => (
                        <button className="option" key={idx}>
                            {b}
                        </button>
                    ))}
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
