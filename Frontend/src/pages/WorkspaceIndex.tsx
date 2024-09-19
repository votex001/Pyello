import { Outlet } from "react-router-dom"
import { WorkspaceHeader } from "../cmps/Workspace/WorkspaceHeader"
import { WorkspaceMenu } from "../cmps/Workspace/WorkspaceMenu"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    loadBoard,
    loadBoardByTaskId,
    viewBoard,
} from "../store/actions/board.actions"
import { login, editUser } from "../store/actions/user.actions"
import { useSelector } from "react-redux"
import {
    setBoards,
    updateWorkspaceBoard,
} from "../store/actions/workspace.actions"
import { updateBoard } from "../store/actions/board.actions"
import { BoardMenu } from "../cmps/BoardHeader/BoardMenu/BoardMenu"
import { utilService } from "../services/util.service"
import { ErrorPage } from "./ErrorPage"
import { socketService } from "../services/socket.service"
import { setSessionStorage, getSessionStorage } from "../services/local.service"
import { RootState } from "../store/store"
import { CloseBoardActivity } from "../models/activities.models"

export function WorkspaceIndex() {
    const user = useSelector((state: RootState) => state.userModule.user)
    const [isLoaded, setIsLoaded] = useState(true)
    const boardsInfo = useSelector(
        (state: RootState) => state.workspaceModule.boards
    )
        ?.filter((b) => user && b?.members?.some((m) => m.id === user.id))
        .filter((b) => !b.closed)
        .map((b) => ({
            id: b.id,
            name: b.name,
            closed: b.closed,
            coverImg: b.prefs.backgroundImage,
        }))
    const boards = useSelector(
        (state: RootState) => state.workspaceModule.boards
    )
    const board = useSelector((state: RootState) => state.boardModule.board)
    const boardBgPrefs = useSelector(
        (state: RootState) => state.boardModule.board
    )?.prefs

    const [selectedBoardId, setSelectedBoardId] = useState<string>("")
    const [starredBoardIds, setStarredBoardIds] = useState<string[]>([])
    const [wrongInviteLink, setWrongInviteLink] = useState(false)
    const [isUserBoards, setIsUserBoards] = useState(false)
    const [darkMode, setDarkMode] = useState<"light" | "dark" | "default" | "">(
        ""
    )
    const [openBoardMenu, setOpenBoardMenu] = useState(false)
    const [showBtn, setShowBtn] = useState(false)

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        socketService.subscribeToWorkspace()

        socketService.on("workspace-updated", (data) => {
            const { boardId, byUserId } = data
            const userId = getSessionStorage("userId")
            if (userId && byUserId !== userId) {
                updateWorkspaceBoard(boardId)
            } else if (!userId) {
                console.error("No user in workspace-updated")
            }
        })

        return () => {
            socketService.unsubscribeFromWorkspace()
        }
    }, [])

    useEffect(() => {
        setWorkSpaceBoards()
        getUser()
    }, [])

    useEffect(() => {
        if (
            window.location.pathname === "" ||
            window.location.pathname === "/"
        ) {
            navigate("/home")
        }
    }, [navigate])

    useEffect(() => {
        if (user) {
            setDarkMode(user?.darkMode)
            setSessionStorage("userId", user.id)
        }
    }, [user])

    useEffect(() => {
        setBoardByParams()
    }, [params])

    async function setBoardByParams() {
        if (params.boardId) {
            setIsLoaded(false)
            await loadBoard(params.boardId)
            setSelectedBoardId(params.boardId)
            setIsUserBoards(false)
            viewBoard(params.boardId)
            setIsLoaded(true)
        }
        if (params.cardId) {
            setIsLoaded(false)
            try {
                const boardId = await loadBoardByTaskId(params.cardId)
                if (!boardId) throw `Can't find board with id ${params.cardId}`
                setSelectedBoardId(boardId)
                setIsUserBoards(false)
                viewBoard(boardId)
                setIsLoaded(true)
            } catch (e) {
                console.log(e)
                throw e
            }
        }
    }

    //Notice any change in user page is through this
    //Make sure that changes dont break navigation
    useEffect(() => {
        if (!params.boardId && !params.cardId && user && !isUserBoards) {
            setSelectedBoardId("")
        }
    }, [params, user, isUserBoards])

    async function setWorkSpaceBoards() {
        setIsLoaded(false)
        await setBoards()
        setIsLoaded(true)
        // setTimeout(() => {
        // }, 200);
    }

    async function getUser() {
        setIsLoaded(false)
        const user = await login()
        setIsLoaded(true)
        if (!user) {
            navigate("/home")
        }
        // setTimeout(() => {
        // }, 200);
    }

    useEffect(() => {
        if (user) setStarredBoardIds(user?.starredBoardIds)
    }, [user])

    useEffect(() => {
        if (params.link && params.link !== board?.invLink) {
            setWrongInviteLink(true)
        } else {
            setWrongInviteLink(false)
        }
    }, [params, board])

    useEffect(() => {
        // Update <html> class based on darkMode state
        if (darkMode === "dark") {
            document.querySelector("html")?.classList.add("dark")
        } else if (darkMode === "light") {
            document.querySelector("html")?.classList.remove("dark")
        }
        if (darkMode === "default") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.querySelector("html")?.classList.add("dark")
            } else if (
                !window.matchMedia("(prefers-color-scheme: dark)").matches
            ) {
                document.querySelector("html")?.classList.remove("dark")
            }
        }
    }, [darkMode])

    function onStarClick(boardId: string) {
        if (!user) return
        const isStarred = user?.starredBoardIds.includes(boardId)
        const starredBoardIds = isStarred
            ? user.starredBoardIds.filter((id) => id !== boardId)
            : [...user.starredBoardIds, boardId]
        editUser({ ...user, starredBoardIds })
    }

    function onCloseBoard(boardId: string) {
        console.log("onCloseBoard", boardId)
        const board = boards?.find((b) => b.id === boardId)
        if (!board || !user) return
        const newActivity = utilService.createActivity(
            {
                type: "closeBoard",
            },
            user
        ) as CloseBoardActivity
        if (board) {
            updateBoard({
                ...board,
                closed: true,
                activities: [...board?.activities, newActivity],
            })
        }
    }

    function onLeaveBoard(boardId: string) {
        const board = boards?.find((b) => b.id === boardId)
        if (board) {
            updateBoard({
                ...board,
                members: board.members.filter((m) => m.id !== user?.id),
            })
        }
    }
    const contextValues = {
        setOpenBoardMenu,
        openBoardMenu,
        showBtn,
        setShowBtn,
    }
    return (
        <section
            className={`workspace ${isUserBoards ? "user-boards-bg" : ""}`}
            style={{
                backgroundImage:
                    selectedBoardId && boardBgPrefs?.backgroundImage
                        ? `url(${boardBgPrefs.backgroundImage})`
                        : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <WorkspaceHeader
                bgColor={
                    (!wrongInviteLink &&
                        selectedBoardId &&
                        boardBgPrefs?.backgroundColor) ||
                    ""
                }
                userName={user?.username}
                setDarkMode={setDarkMode}
                darkMode={darkMode}
            />
            {!wrongInviteLink ? (
                <>
                    {user && starredBoardIds && selectedBoardId ? (
                        <section className="workspace-content">
                            {isLoaded && (
                                <>
                                    {board?.id ? (
                                        <>
                                            <WorkspaceMenu
                                                colorTheme={
                                                    boardBgPrefs?.backgroundBrightness
                                                }
                                                boardsInfo={
                                                    user?.isAdmin
                                                        ? boards
                                                              ?.filter(
                                                                  (b) =>
                                                                      !b.closed
                                                              )
                                                              .map((b) => ({
                                                                  id: b.id,
                                                                  name: b.name,
                                                                  closed: b.closed,
                                                                  coverImg:
                                                                      b.prefs
                                                                          .backgroundImage,
                                                              }))
                                                        : boardsInfo
                                                }
                                                selectedBoardId={
                                                    selectedBoardId
                                                }
                                                starredBoardIds={
                                                    starredBoardIds
                                                }
                                                onStarClick={onStarClick}
                                                closeBoard={onCloseBoard}
                                                leaveBoard={onLeaveBoard}
                                            />
                                            <Outlet context={contextValues} />
                                        </>
                                    ) : (
                                        <>
                                            {isLoaded && (
                                                <ErrorPage wrongUrl={true} />
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                            {openBoardMenu && (
                                <BoardMenu
                                    setOpenBoarMenu={setOpenBoardMenu}
                                    setShowBtn={setShowBtn}
                                />
                            )}
                        </section>
                    ) : (
                        <>{isLoaded && <Outlet />}</>
                    )}
                </>
            ) : (
                <>{isLoaded && <ErrorPage wrongUrl={true} />}</>
            )}
        </section>
    )
}
