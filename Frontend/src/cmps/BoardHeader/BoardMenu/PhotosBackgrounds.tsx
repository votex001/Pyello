import { useSelector } from "react-redux"
import { utilService } from "../../../services/util.service"
import { updateBoard } from "../../../store/actions/board.actions"
import { RootState } from "../../../store/store"
import { ChangeBackGroundActivity } from "../../../models/activities.models"

export function PhotosBackgrounds() {
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)
    interface bg {
        background: string
        title: string
        backgroundColor: string
        backgroundImage: string
        backgroundBrightness: string
        backgroundImageScaled: {
            width: number
            height: number
            url: string
        }[]
    }
    function onPickPhoto(bg: bg) {
        if (user && board) {
            const newActivity = utilService.createActivity(
                {
                    type: "changeBackGround",
                },
                user
            ) as ChangeBackGroundActivity
            const prefs = {
                background: bg.background,
                backgroundColor: bg.backgroundColor,
                backgroundImage: bg.backgroundImage,
                backgroundBrightness: bg.backgroundBrightness,
                backgroundImageScaled: bg.backgroundImageScaled,
            }
            updateBoard({
                ...board,
                prefs,
                activities: [...board?.activities, newActivity],
            })
        }
    }

    return (
        <section className="photos-bg navigation">
            {utilService.getBgImgs(false).map((bg) => (
                <section
                    onClick={() => onPickPhoto(bg)}
                    className="container photos"
                    key={bg.background}
                    style={{
                        backgroundImage: `url(${bg.backgroundImageScaled[2].url})`,
                    }}
                >
                    <span className="title">{bg.title}</span>
                </section>
            ))}
        </section>
    )
}
