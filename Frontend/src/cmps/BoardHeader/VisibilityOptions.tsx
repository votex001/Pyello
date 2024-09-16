import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ReactSVG } from "react-svg"
import privateIcon from "/img/board-index/headerImgs/privateIcon.svg"
import publicIcon from "/img/board-index/headerImgs/publicIcon.svg"
import peopleIcon from "/img/board-index/headerImgs/peopleIcon.svg"
import permissionIcon from "/img/board-index/headerImgs/permissionIcon.svg"
import { updateBoard } from "../../store/actions/board.actions"
import { utilService } from "../../services/util.service"
import { ChangeVisibilityActivity } from "../../models/activities.models"
import { RootState } from "../../store/store"

interface VisibilityOptionsProps {
    setOpenListMenu: (value: boolean) => void
}

export function VisibilityOptions({ setOpenListMenu }: VisibilityOptionsProps) {
    const [hasAcces, setHasAcces] = useState(false)
    const user = useSelector((state: RootState) => state.userModule.user)
    const currentMember = useSelector((state: RootState) =>
        state.boardModule.board?.members.find(
            (member) => member.id === user?.id
        )
    )
    const board = useSelector((state: RootState) => state.boardModule.board)
    useEffect(() => {
        if (currentMember?.permissionStatus === "admin" || user?.isAdmin) {
            setHasAcces(true)
        } else {
            setHasAcces(false)
        }
    }, [currentMember])

    function permissionCheck(permission: "private" | "org" | "public") {
        if (permission === board?.permissionLevel) {
            return (
                <ReactSVG
                    src={permissionIcon}
                    wrapper="span"
                    className="permission-icon"
                />
            )
        }
        return ""
    }

    function onPermissionClick(value: "private" | "org" | "public") {
        if (board && user) {
            const newActivity = utilService.createActivity(
                {
                    type: "changeVisibility",
                    visibility: value,
                },
                user
            ) as ChangeVisibilityActivity
            board.permissionLevel = value
            board.activities.push(newActivity)
            const newBoard = board
            updateBoard(newBoard)
        }
        setOpenListMenu(false)
    }
    interface Option {
        value: "private" | "org" | "public"
        label: string
        txt: string
        svg: string
    }
    const options = [
        {
            value: "private",
            label: "Private",
            txt: " Only board members can see this board. Workspace admins can close the board or remove members.",
            svg: privateIcon,
        },
        {
            value: "org",
            label: "Workspace",
            txt: "All members of the Pyello Workspace Workspace can see and edit this board.",
            svg: peopleIcon,
        },
        {
            value: "public",
            label: "Public",
            txt: "Anyone on the internet can see this board. Only board members can edit.",
            svg: publicIcon,
        },
    ] as Option[]

    return (
        <nav className="popover-nav">
            <ul>
                {options.map((option) => (
                    <li key={option.value}>
                        <button
                            className={`${option.value}-btn btn`}
                            disabled={!hasAcces}
                            onClick={() => onPermissionClick(option.value)}
                        >
                            <span className={`${option.value}-header`}>
                                <ReactSVG
                                    src={option.svg}
                                    wrapper="span"
                                    className="icon"
                                />
                                {option.label}
                                {permissionCheck(option.value)}
                            </span>
                            <div className={`${option.value}-body`}>
                                {option.txt}
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
