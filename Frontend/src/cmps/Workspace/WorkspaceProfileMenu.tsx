import { Popover } from "antd"
import { useState } from "react"
import { UserAvatar } from "../UserAvatar"
import { Link } from "react-router-dom"
import more from "/img/workspace/more.svg"
import { ReactSVG } from "react-svg"
import { WorkspaceThemePopover } from "./WorkspaceThemePopover"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"

interface WorkspaceProfileMenuProps {
    setDarkMode: (string: "light" | "dark" | "default") => void
    darkMode: "light" | "dark" | "default" | ""
    anchorEl: React.ReactNode
}

export function WorkspaceProfileMenu({
    anchorEl,
    setDarkMode,
    darkMode,
}: WorkspaceProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const user = useSelector((state: RootState) => state.userModule.user)

    function onClose() {
        setIsOpen(false)
    }
    const settings = [
        <Link to={`/u/${user?.username}`} onClick={onClose}>
            Profile
        </Link>,
        <WorkspaceThemePopover
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            anchorEl={
                <button className="theme-btn">
                    <span>Theme</span>
                    <ReactSVG className="arrow" src={more} wrapper="span" />
                </button>
            }
        />,
        <Link to={`/login`} onClick={onClose}>
            Logout
        </Link>,
    ]

    return (
        <Popover
            trigger="click"
            placement="bottomRight"
            open={isOpen}
            onOpenChange={setIsOpen}
            arrow={false}
            content={
                <section className="workspace-profile-menu">
                    <header className="about">
                        <h2 className="workspace-menu-title">Account</h2>
                        <section className="profile">
                            <UserAvatar
                                className="user-avatar"
                                user={user}
                                size={40}
                            />
                            <div className="names">
                                <span className="full-name">
                                    {user?.fullName}
                                </span>
                                <span className="user-email">
                                    {user?.email}
                                </span>
                            </div>
                        </section>
                        <hr></hr>
                    </header>
                    <section className="settings">
                        <h2 className="workspace-menu-title">TRELLO</h2>
                        <ul className="items">
                            {settings.map((i, idx) => (
                                <li key={idx} className="setting-btn">
                                    {i}
                                </li>
                            ))}
                        </ul>
                    </section>
                </section>
            }
        >
            {anchorEl}
        </Popover>
    )
}
