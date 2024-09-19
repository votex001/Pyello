import { StarOutlined, StarFilled } from "@ant-design/icons"
import React, { useState, useEffect } from "react"

interface StarBoardBtnProps {
    starredBoardIds?: string[]
    boardId?: string
    starClick: (id: string) => void
}

export function StarBoardBtn({
    starredBoardIds,
    boardId,
    starClick,
}: StarBoardBtnProps) {
    const [hover, setHover] = useState(false)
    const [isStarredBoard, setIsStarredBoard] = useState(false)

    useEffect(() => {
        if (boardId && starredBoardIds) {
            setIsStarredBoard(starredBoardIds.includes(boardId))
        }
    }, [starredBoardIds, boardId])

    function onStarClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        if (starClick && boardId) {
            starClick(boardId)
        }
    }
    return (
        <button
            className={`star-board-btn  ${isStarredBoard ? "starred" : ""}`}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={onStarClick}
        >
            {isStarredBoard ? (
                hover ? (
                    <StarOutlined />
                ) : (
                    <StarFilled />
                )
            ) : hover ? (
                <StarFilled />
            ) : (
                <StarOutlined />
            )}
        </button>
    )
}
