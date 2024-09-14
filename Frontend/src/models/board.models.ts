import { Activity } from "./activities.models"
import { Group } from "./task&groups.models"

export interface Label {
    id: string
    color: string
    name: string
}
export interface LabelColorOption {
    color: string
    bgColor: string
    hoveredBgColor: string
    darkFontColor: string
    lightFontColor: string
    isCover?: boolean // Optional, only for certain labels
    brightness?: "light" // Optional, only for certain labels
}
export interface Member {
    id: string
    permissionStatus: string
    fullName: string
}

export interface Board {
    id?: string
    prefs: {
        background: string
        backgroundColor: string | null
        backgroundImage: string | null
        backgroundBrightness: string
        backgroundImageScaled: string | null
    }
    members: Member[]
    checkListTaskIds: string[]
    name: string
    groups: Group[]
    labels: Label[]
    coverImgs: any[]
    activities: Activity[]
    updatedAt: number
    viewedAt: number
}
