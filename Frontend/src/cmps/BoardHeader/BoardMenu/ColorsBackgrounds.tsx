import { useSelector } from "react-redux"
import { utilService } from "../../../services/util.service"
import { updateBoard } from "../../../store/actions/board.actions"
import { RootState } from "../../../store/store"

export function ColorsBackgrounds() {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)

    interface bg {
        background: string
        backgroundColor: string
        backgroundImage: string
        backgroundBrightness: string
    }

    function onPickColor(bg: bg) {
        if (board && user) {
            const newActivity = utilService.createActivity(
                {
                    type: "changeBackGround",
                },
                user
            )
            const prefs = {
                background: bg.background,
                backgroundColor: bg.backgroundColor,
                backgroundImage: bg.backgroundImage,
                backgroundBrightness: bg.backgroundBrightness,
            }

            updateBoard({
                ...board,
                prefs,
                activities: [...board?.activities, newActivity],
            })
        }
    }

    return (
        <section className="navigation">
            <section className="photos-bg">
                {utilService.getBgGradientColors().map((bg) => (
                    <section
                        onClick={() => onPickColor(bg)}
                        className="container"
                        key={bg.background}
                        style={{
                            backgroundImage: `url(${bg.backgroundImage})`,
                        }}
                    >
                        <span className="emoji">{bg.emoji}</span>
                    </section>
                ))}
            </section>
            <hr className="border_bottom" />
            <section className="colors-picker">
                {utilService.getBgColors().map((color) => (
                    <section
                        onClick={() => onPickColor(color)}
                        className="container"
                        key={color.background}
                        style={{ backgroundColor: color.backgroundColor }}
                    ></section>
                ))}
            </section>
        </section>
    )
}
