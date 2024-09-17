import { Activity } from "./activities.models"
import { Group } from "./task&groups.models"

export interface Label {
    id: string
    color: string
    name: string
    isTask: boolean
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
    permissionStatus: "admin" | "member"
    fullName: string
}

export interface Board {
    desc: string
    closed: boolean
    id?: string
    permissionLevel: "private" | "org" | "public"
    prefs: {
        background: string
        backgroundColor: string | null
        backgroundImage: string | null
        backgroundBrightness: string
        backgroundImageScaled?:
            | {
                  width: number
                  height: number
                  url: string
              }[]
            | null
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
    invLink: string | null
}
