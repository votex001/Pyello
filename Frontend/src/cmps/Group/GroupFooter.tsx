import { PlusOutlined } from "@ant-design/icons"
import templateCard from "../../assets/svgs/template-card.svg"
import { ReactSVG } from "react-svg"
import { useClickOutside } from "../../customHooks/useClickOutside"
import useScrollPercentage from "../../customHooks/useScrollPercentage"
import { RefObject } from "react"

interface GroupFooterProps {
    groupRef: RefObject<HTMLElement>
    openBottomAddTask?: () => void
}

export function GroupFooter({ groupRef, openBottomAddTask }: GroupFooterProps) {
    const [footerRef, isAddTaskOpen] = useClickOutside(false)
    const [_, setScrollToPercentage] = useScrollPercentage(groupRef)

    function onBtnClick() {
        // setIsAddTaskOpen(true);
        if (openBottomAddTask) openBottomAddTask()
        setTimeout(() => {
            setScrollToPercentage(200)
        }, 0)
    }

    return (
        <div className="list-footer" ref={footerRef}>
            {!isAddTaskOpen && (
                <>
                    <button className="add-card-btn" onClick={onBtnClick}>
                        <PlusOutlined />
                        &nbsp;&nbsp;Add a card
                    </button>
                    <button className="use-template-btn">
                        <ReactSVG
                            src={templateCard}
                            className="template-card"
                            wrapper="span"
                        />
                    </button>
                </>
            )}
        </div>
    )
}
