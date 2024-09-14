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
    attachment: string | null
    color: string | null
    size: "small" | "normal" | "large"
    brightness: "light" | "dark"
    edgeColor: string
}

export interface Task {
    id: string
    attachments: string[]
    updatedAt: string
    members: string[]
    checkLists: CheckList[]

    closed: boolean
    dueComplete: boolean
    dateLastActivity: string
    desc: string
    due: Date | null
    dueReminder: Date | null
    idBoard: string
    idGroup: string
    idMembers: string[]
    idLabels: string[]
    name: string
    pos: number
    start: Date | null
    cover: Cover
    checkListTaskIds: string[]
    activities: any[] // You can specify a more precise type if needed
}
