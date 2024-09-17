import {
    bgColors,
    bgGradientColors,
    bgImgs,
    boardLabelColorOptions,
    labels,
    taskCoverImgs,
} from "./Data"
import dayjs, { Dayjs } from "dayjs"
import { httpService } from "./http.service"
import { User } from "../models/user.model"
import { Activity } from "../models/activities.models"
import { CheckItem, CheckList, Group, Task } from "../models/task&groups.models"
import { Board, Label, Member } from "../models/board.models"

export const utilService = {
    makeId,
    getColorHashByName,
    capitalizeInitials,
    stringToColor,
    createNewTask,
    createNewGroup,
    getBaseColors,
    createNewBoard,
    getBgImgs,
    getBgGradientColors,
    createNewLabel,
    createCheckListItem,
    createCheckList,
    getEmojis,
    getChecklistBadge,
    createActivity,
    isValidUrl,
    getAverageBorderColor, //
    isColorDark, //
    isNotEmpty,
    getBgColors,
    getDateLabel,
    taskDueStatus,
    datePreviewTitle,
    tooltipOuterStyle,
}

export const BOARDS_KEY = "boards"

function makeId(length = 6) {
    var txt = ""
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function isValidUrl(string: string) {
    try {
        new URL(string)
        return true
    } catch (err) {
        return false
    }
}

function getColorHashByName(colorName?: string | null) {
    const color = boardLabelColorOptions.find(
        (color) => color.color === colorName
    )
    return color
}

function capitalizeInitials(string: string) {
    return string
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
}

function createActivity<T extends Activity>(
    activity: Omit<T, "id" | "userFullName" | "userId" | "timeStamp">,
    user: User
): T {
    return {
        id: utilService.makeId(24),
        userFullName: user.fullName,
        userId: user.id,
        timeStamp: Date.now(),
        ...activity,
    } as T
}

export function stringToColor(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = "#"
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += ("00" + value.toString(16)).substr(-2)
    }
    return color
}

function createNewTask(task: {
    idBoard: string
    groupId: string
    name: string
}): Task {
    return {
        id: utilService.makeId(),
        attachments: [],
        updatedAt: new Date().toISOString(),
        members: [],
        checkLists: [],

        closed: false,
        dueComplete: false,
        dateLastActivity: new Date().toISOString(),
        desc: "",
        due: null,
        dueReminder: null,
        idBoard: task.idBoard,
        idGroup: task.groupId,
        idMembers: [],
        idLabels: [],
        name: task.name,
        pos: -1, // Default position, can be adjusted
        start: null,
        cover: {
            attachment: null,
            color: null,
            size: "normal",
            brightness: "light",
            edgeColor: "",
            scaled: null,
        },
        checkListTaskIds: [],
        createdAt: Date.now(),
    }
}

function createNewGroup(group: {
    idBoard: string
    name: string
    pos: number
}): Group {
    return {
        id: utilService.makeId(),
        idBoard: group.idBoard,
        name: group.name,
        closed: false,
        color: null,
        pos: group.pos,
        tasks: [],
        updatedAt: null,
    }
}
interface ChecklistBadge {
    count: string | null
    allChecked: boolean
}

function getChecklistBadge(checkLists: CheckList[] | null): ChecklistBadge {
    const badges: ChecklistBadge = {
        count: null,
        allChecked: false,
    }

    if (!checkLists) return badges

    const flatCheckItems = checkLists.flatMap(
        (checklist) => checklist.checkItems
    )

    const totalCheckdItemsLength = checkLists.reduce((sum, checklist) => {
        const localItemsCount = checklist.checkItems.filter(
            (item) => item.isChecked
        ).length
        return sum + localItemsCount
    }, 0)

    const taskCheckedItemsCount = flatCheckItems.length

    if (taskCheckedItemsCount / totalCheckdItemsLength === 1) {
        badges.allChecked = true
    }
    if (taskCheckedItemsCount) {
        badges.count = `${totalCheckdItemsLength}/${taskCheckedItemsCount}`
    }

    return badges
}

async function createNewBoard(board: {
    backgroundData: {
        background: string
        backgroundColor?: string | null
        backgroundImage?: string | null
        backgroundBrightness: string
        backgroundImageScaled?:
            | {
                  width: number
                  height: number
                  url: string
              }[]
            | null
    }
    name: string
}): Promise<Board> {
    const user: User = await httpService.post("user/checkToken")

    const member: Member = {
        id: user.id,
        permissionStatus: "admin",
        fullName: user.fullName,
    }
    return {
        desc: "",
        closed: false,
        permissionLevel: "org",
        prefs: {
            background: board.backgroundData.background,
            backgroundColor: board.backgroundData?.backgroundColor || null,
            backgroundImage: board.backgroundData?.backgroundImage || null,

            backgroundBrightness: board.backgroundData.backgroundBrightness,
            backgroundImageScaled:
                board.backgroundData?.backgroundImageScaled || null,
        },
        members: [member],
        checkListTaskIds: [],
        name: board.name,
        groups: [],
        labels: labels,

        coverImgs: taskCoverImgs,
        activities: [
            {
                id: utilService.makeId(24),
                type: "createBoard",
                userFullName: user.fullName,
                userId: user.id,
                timeStamp: 1722015726446,
            },
        ],
        updatedAt: Date.now(),
        viewedAt: Date.now(),
        invLink: null,
    }
}

function createNewLabel(name: string, color: string): Label {
    return {
        id: makeId(),
        name: name,
        color: color,
        isTask: false,
    }
}

function getBaseColors() {
    return boardLabelColorOptions.filter((color) => color.isCover)
}

function getBgImgs(slice = true) {
    if (slice) {
        return bgImgs.slice(0, 4)
    } else {
        return bgImgs
    }
}

function getBgGradientColors() {
    return bgGradientColors
}

function getBgColors() {
    return bgColors
}
function createCheckListItem(changes: {
    label: string
    [key: string]: any // Allows additional properties of any type
}): CheckItem {
    const { label, ...rest } = changes // Extract label and the rest of the properties

    return {
        id: utilService.makeId(24),
        label,
        isChecked: false,
        pos: 0,
        ...rest, // Include additional properties here
    }
}
function createCheckList(changes: {
    label: string
    [key: string]: any // Allows additional properties of any type
}): CheckList {
    const { label, ...rest } = changes // Extract label and the rest of the properties

    return {
        id: utilService.makeId(24),
        label,
        pos: 0,
        checkItems: [],
        ...rest,
    }
}

function getEmojis() {
    return [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😚",
        "😋",
        "😛",
        "😝",
        "🤪",
        "🤨",
        "🧐",
        "🤓",
        "😎",
        "🤩",
        "🥳",
    ]
}

function isColorDark(r: number, g: number, b: number): boolean {
    // Calculate the perceived brightness using the formula:
    // (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return brightness < 0.5
}

function getAverageBorderColor(
    imageSrc: string,
    borderWidth = 1
): Promise<{ color: string; isDark: boolean }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "Anonymous" // This enables CORS
        img.onload = function () {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height
            if (!ctx) {
                return reject(new Error("Failed to get canvas context"))
            }
            ctx.drawImage(img, 0, 0, img.width, img.height)

            let r = 0,
                g = 0,
                b = 0,
                count = 0

            // Top and bottom borders
            for (let x = 0; x < img.width; x++) {
                for (let y = 0; y < borderWidth; y++) {
                    let data = ctx.getImageData(x, y, 1, 1).data
                    r += data[0]
                    g += data[1]
                    b += data[2]
                    count++

                    data = ctx.getImageData(x, img.height - 1 - y, 1, 1).data
                    r += data[0]
                    g += data[1]
                    b += data[2]
                    count++
                }
            }

            // Left and right borders
            for (let y = borderWidth; y < img.height - borderWidth; y++) {
                for (let x = 0; x < borderWidth; x++) {
                    let data = ctx.getImageData(x, y, 1, 1).data
                    r += data[0]
                    g += data[1]
                    b += data[2]
                    count++

                    data = ctx.getImageData(img.width - 1 - x, y, 1, 1).data
                    r += data[0]
                    g += data[1]
                    b += data[2]
                    count++
                }
            }

            r = Math.round(r / count)
            g = Math.round(g / count)
            b = Math.round(b / count)

            const color = `rgb(${r},${g},${b})`
            const isDark = isColorDark(r, g, b)

            resolve({ color, isDark })
        }
        img.onerror = reject
        img.src = imageSrc
    })
}

function isNotEmpty(value: any): boolean {
    if (typeof value === "string") {
        return value.trim() !== ""
    }
    if (dayjs.isDayjs(value)) {
        return value.isValid()
    }
    return false
}

function taskDueStatus(task: {
    due: Dayjs | null
    dueComplete: boolean
}): [string, string] {
    if (task.dueComplete) return ["completed", "This card is completed"]

    const dueDate = dayjs(task?.due)
    const now = dayjs()
    const diff = dueDate.diff(now, "hours")

    if (diff < -24) return ["overdue", "This card is overdue"]
    if (diff < 0)
        return ["recently-overdue", "This card is due in the next 24 hours"]
    if (diff > 24) return ["due", "This card is due in the next 24 hours"]
    if (diff > 0) return ["due-soon", "This card is due in the next 24 hours"]
    return ["", ""]
}

function getDateLabel(date?: string | dayjs.Dayjs): string {
    if (!date) return ""

    const parsedDate = dayjs(date)
    if (parsedDate.isSame(dayjs(), "year")) {
        return parsedDate.format("MMM D")
    } else {
        return parsedDate.format("MMM D YYYY")
    }
}

function datePreviewTitle(
    start?: string | dayjs.Dayjs | null,
    due?: string | dayjs.Dayjs | null
): string | undefined {
    if (!start || !due) return
    // Check if both start and due are not empty
    if (!isNotEmpty(start) && !isNotEmpty(due)) return ""

    // If both start and due are provided, format both dates
    if (isNotEmpty(start) && isNotEmpty(due)) {
        return `${getDateLabel(start)} - ${getDateLabel(due)}`
    }

    // If only start is provided
    if (isNotEmpty(start)) {
        return `Start: ${getDateLabel(start)}`
    }

    // If only due is provided
    if (isNotEmpty(due)) {
        return `Due: ${getDateLabel(due)}`
    }

    // Default return in case of any other condition (should not be hit)
    return ""
}

function tooltipOuterStyle() {
    return {
        padding: "1px 3px",
        minHeight: "16px",
        fontSize: "10px",
        borderRadius: "3px",
        backgroundColor: "#42546f",
    }
}
