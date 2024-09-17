import { Dayjs } from "dayjs"

export interface Group {
    id: string
    idBoard: string
    name: string
    closed: boolean
    color: string | null
    pos: number
    tasks: Task[]
    updatedAt: string | null
}
export interface CheckItem {
    id: string
    label: string
    isChecked: boolean
    pos: number
}

// Interface for a checklist
export interface CheckList {
    id: string
    label: string
    pos: number
    checkItems: CheckItem[] // Array of items within the checklist
}

export interface Cover {
    attachment: {
        link: string
        text: string
        avgBgColor: { color: string; isDark: boolean }
    } | null
    color: string | null
    size: "small" | "normal" | "full"
    brightness: "light" | "dark"
    edgeColor: string
    scaled: string | null
}
export interface attachment {
    id: string
    link: string
    text: string
    createdAt: string
    type: string
}

export interface Task {
    id: string
    attachments: attachment[]
    updatedAt: string
    members: string[]
    checkLists: CheckList[]

    closed: boolean
    dueComplete: boolean
    dateLastActivity: string
    desc: string
    due: Dayjs | null
    dueReminder: string | null
    idBoard: string
    idGroup: string
    idMembers: string[]
    idLabels: string[]
    name: string
    pos: number
    start: Dayjs | null
    cover: Cover
    checkListTaskIds: string[]
    createdAt: number
}
