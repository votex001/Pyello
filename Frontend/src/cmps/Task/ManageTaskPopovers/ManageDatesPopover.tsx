import { Calendar, Input } from "antd"
import { ManageTaskPopoverHeader } from "./ManageTaskPopoverHeader"
import dayjs, { Dayjs } from "dayjs"
import { useState, useRef, useEffect } from "react"
import { SvgButton } from "../../CustomCpms/SvgButton"
import { CustomSelect } from "../../CustomCpms/CustomSelect"
import { utilService } from "../../../services/util.service"
import { useSelector } from "react-redux"
import { editTask, updateBoard } from "../../../store/actions/board.actions"
import { CheckBox } from "../../CustomCpms/CheckBox"
import Popup, { TriggerProps } from "@atlaskit/popup"
import { Task } from "../../../models/task&groups.models"
import { RootState } from "../../../store/store"
import { CellRenderInfo } from "rc-picker/lib/interface"
import {
    AddDateActivity,
    RemoveDateActivity,
} from "../../../models/activities.models"
import { PickerLocale } from "antd/es/date-picker/generatePicker"
import { TimePickerLocale } from "antd/es/time-picker"

const customLocale: PickerLocale = {
    lang: {
        locale: "en",
        shortWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: "Today",
        now: "Now",
        backToToday: "Back to today",
        ok: "OK",
        clear: "Clear",
        month: "Month",
        year: "Year",
        timeSelect: "Select time",
        dateSelect: "Select date",
        monthSelect: "Select month",
        yearSelect: "Select year",
        decadeSelect: "Select decade",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        previousYear: "Previous year",
        nextYear: "Next year",
        previousDecade: "Previous decade",
        nextDecade: "Next decade",
        previousCentury: "Previous century",
        nextCentury: "Next century",
        placeholder: "Select date", // Added placeholder property
    },
    timePickerLocale: {
        placeholder: "Select time",
        // Additional properties for TimePickerLocale if needed
    } as TimePickerLocale,
}

interface ManageDatesPopoverProps {
    anchorEl: React.ReactNode
    task?: Task
}

export function ManageDatesPopover({
    anchorEl,
    task,
}: ManageDatesPopoverProps) {
    const [isOpen, setIsOpen] = useState(false)

    function onClose() {
        setIsOpen(false)
    }

    const onTriggerClick = () => {
        setIsOpen((prev) => !prev)
    }

    const trigger = (triggerProps: TriggerProps) => {
        return (
            <label
                {...triggerProps}
                // isSelected={isOpen}
                onClick={onTriggerClick}
            >
                {anchorEl}
            </label>
        )
    }

    return (
        <Popup
            id="manage-dates-popover-popup"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom-start"
            fallbackPlacements={["top-start", "auto"]}
            content={() => (
                <ManageDatesPopoverContent task={task} onClose={onClose} />
            )}
            trigger={trigger}
            zIndex={10000}
        />
    )
}
interface ManageDatesPopoverContentProps {
    task?: Task
    onClose: () => void
}

function ManageDatesPopoverContent({
    task,
    onClose,
}: ManageDatesPopoverContentProps) {
    const [value, setValue] = useState(dayjs())
    const board = useSelector((state: RootState) => state.boardModule.board)
    const user = useSelector((state: RootState) => state.userModule.user)

    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [startDateInputValue, setStartDateInputValue] = useState<
        string | undefined
    >("")
    const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
        null
    )
    const [lastSelectedStartDate, setLastSelectedStartDate] =
        useState<Dayjs | null>(null)

    const [endDate, setEndDate] = useState<Dayjs | null>(null)
    const [endDateInputValue, setEndDateInputValue] = useState<
        string | undefined
    >("")
    const [endTimeInputValue, setEndTimeInputValue] = useState("")
    const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null)
    const [lastSelectedEndDate, setLastSelectedEndDate] =
        useState<Dayjs | null>(null)

    const [focusedInput, setFocusedInput] = useState("end") //end endTime or start or "none"

    const [reminder, setReminder] = useState<string | null | undefined>(
        task?.dueReminder || null
    )

    const startDateRef = useRef(null)
    const endDateRef = useRef(null)
    const endTimeRef = useRef(null)

    useEffect(() => {
        if (task?.start && !task.due) {
            setStartDate(dayjs(task.start))
            setValue(dayjs(task.start))
            setSelectedStartDate(dayjs(task.start))
            setFocusedInput("start")
        }
        if (task?.due && !task.start) {
            setEndDate(dayjs(task.due))
            setValue(dayjs(task.due))
            setSelectedEndDate(dayjs(task.due))
            setFocusedInput("end")
        }
        if (task?.start && task.due) {
            setStartDate(dayjs(task.start))
            setEndDate(dayjs(task.due))
            setSelectedStartDate(dayjs(task.start))
            setSelectedEndDate(dayjs(task.due))
            setFocusedInput("end")
        }
        if (!task?.start && !task?.due) {
            setEndDate(dayjs().add(1, "day"))
            setSelectedEndDate(dayjs().add(1, "day"))
            setFocusedInput("end")
        }
    }, [])

    useEffect(() => {
        if (!dayjs(selectedStartDate).isSame(startDate)) {
            setStartDate(selectedStartDate)
            if (
                selectedEndDate &&
                dayjs(selectedEndDate).isBefore(selectedStartDate)
            ) {
                setSelectedEndDate(dayjs(selectedStartDate).add(1, "day"))
            }
        }
        if (
            selectedStartDate &&
            !dayjs(selectedStartDate).isSame(lastSelectedStartDate)
        ) {
            setLastSelectedStartDate(selectedStartDate)
        }
    }, [selectedStartDate])

    useEffect(() => {
        if (!selectedEndDate) return

        const currentHour = endDate?.hour() || 0
        const currentMinute = endDate?.minute() || 0
        if (!endDate || !isSameDay(selectedEndDate, endDate)) {
            const newEndDate = selectedEndDate
                .set("hour", currentHour)
                .set("minute", currentMinute)
            setEndDate(newEndDate)
            if (
                selectedStartDate &&
                dayjs(selectedEndDate).isBefore(selectedStartDate)
            ) {
                setSelectedStartDate(dayjs(selectedEndDate).subtract(1, "day"))
            }
        }

        if (!isSameDay(selectedEndDate, lastSelectedEndDate)) {
            setLastSelectedEndDate(selectedEndDate)
        }
    }, [selectedEndDate])

    useEffect(() => {
        if (startDate) {
            setStartDateInputValue(startDate.format("M/D/YYYY"))
            setFocusedInput("start")
        } else {
            setStartDateInputValue("")
            setFocusedInput("none")
        }
    }, [startDate])

    useEffect(() => {
        if (endDate) {
            setEndDateInputValue(formatDate(endDate))
            setEndTimeInputValue(formatTime(endDate))
            if (!dayjs(endDate).isSame(value)) {
                setValue(endDate)
            }
        } else {
            setEndDateInputValue("")
            setEndTimeInputValue("")
            if (startDate) {
                setFocusedInput("start")
            } else {
                setFocusedInput("none")
            }
        }
    }, [endDate])

    function onSelect(value: dayjs.Dayjs) {
        if (focusedInput === "start") {
            setSelectedStartDate(value)
        } else {
            setSelectedEndDate(value)
            setFocusedInput("end")
        }
    }

    function prevMonth() {
        const newValue = value.subtract(1, "month")
        setValue(newValue)
    }

    function nextMonth() {
        const newValue = value.add(1, "month")
        setValue(newValue)
    }

    function dateCellRender(current: dayjs.Dayjs) {
        const isToday = current.isSame(dayjs(), "day")
        const isSelected =
            current.isSame(selectedStartDate, "day") ||
            current.isSame(selectedEndDate, "day")
        const isInRange =
            selectedStartDate &&
            selectedEndDate &&
            current.isAfter(selectedStartDate, "day") &&
            current.isBefore(selectedEndDate, "day")

        return (
            <div
                className={`calendar-view__day-cell ${isToday && "today"} ${
                    isSelected && "selected"
                } ${isInRange && "in-range"}`}
            >
                <label className="date-label">
                    {current.date()}
                    <span className="today-indicator"></span>
                </label>
            </div>
        )
    }

    function cellRender(day: dayjs.Dayjs, info: CellRenderInfo<dayjs.Dayjs>) {
        if (info.type === "date") return dateCellRender(day)
        return info.originNode
    }

    function onStartDateCheck(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        if (e.target.checked) {
            setFocusedInput("start")
            if (
                lastSelectedStartDate &&
                dayjs(lastSelectedStartDate).isBefore(selectedEndDate)
            ) {
                setSelectedStartDate(lastSelectedStartDate)
            } else {
                if (endDate) {
                    setSelectedStartDate(dayjs(endDate).subtract(1, "day"))
                    setStartDate(dayjs(endDate).subtract(1, "day"))
                } else {
                    setSelectedStartDate(dayjs())
                    setStartDate(dayjs())
                }
            }
        } else {
            setFocusedInput("none")
            setStartDate(null)
            setSelectedStartDate(null)
        }
    }

    function onEndDateCheck(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        if (e.target.checked) {
            setFocusedInput("end")
            if (
                lastSelectedEndDate &&
                (dayjs(lastSelectedEndDate).isAfter(selectedStartDate) ||
                    !selectedStartDate)
            ) {
                setSelectedEndDate(lastSelectedEndDate)
                setEndDate(lastSelectedEndDate)
            } else {
                setSelectedEndDate(
                    startDate ? dayjs(startDate).add(1, "day") : dayjs()
                )
                setEndDate(startDate ? dayjs(startDate).add(1, "day") : dayjs())
            }
        } else {
            setEndDate(null)
            setSelectedEndDate(null)
            setFocusedInput("start")
        }
    }

    function onStartDateBlur() {
        if (isValidDate(startDateInputValue)) {
            if (!dayjs(startDate).isSame(dayjs(startDateInputValue))) {
                setStartDate(dayjs(startDateInputValue))
            }
        } else {
            setStartDateInputValue(formatDate(startDate))
        }
    }

    function onEndDateBlur() {
        if (isValidDate(endDateInputValue)) {
            if (!isSameDay(endDate, dayjs(endDateInputValue))) {
                const currentHour = endDate?.hour() || 0
                const currentMinute = endDate?.minute() || 0
                const newEndDate = dayjs(endDateInputValue)
                    .set("hour", currentHour)
                    .set("minute", currentMinute)
                setEndDate(newEndDate)
            }
        } else {
            setEndDateInputValue(formatDate(endDate))
        }
    }

    function onEndTimeBlur() {
        const time = endTimeInputValue.trim().toUpperCase()
        if (isValidTime(time)) {
            const match = time.match(/(\d{1,2}):(\d{1,2})(?:\s)?([AP]M)/)
            if (match) {
                const [hour, minute, period] = match.slice(1)

                let hour24 = parseInt(hour, 10)
                if (period === "PM" && hour24 !== 12) {
                    hour24 += 12
                } else if (period === "AM" && hour24 === 12) {
                    hour24 = 0
                }

                const endTime = dayjs(endDate)
                    .set("hour", hour24)
                    .set("minute", parseInt(minute, 10))

                if (!endTime.isSame(endDate)) {
                    const currentHour = endTime?.hour() || 0
                    const currentMinute = endTime?.minute() || 0
                    if (endDate) {
                        const newEndDate = endDate
                            .set("hour", currentHour)
                            .set("minute", currentMinute)
                        setEndDate(newEndDate)
                    }
                }
            }
        } else {
            setEndTimeInputValue(formatTime(endDate))
        }
    }

    async function onSave() {
        if (endDate && user && task && board) {
            const newActivity = utilService.createActivity(
                {
                    type: "addDate",
                    targetId: task.id,
                    targetName: task.name,
                    doDate: endDate.toDate().getTime(),
                },
                user
            ) as AddDateActivity

            await updateBoard({
                ...board,
                activities: [...board?.activities, newActivity],
            })
            editTask({
                ...task,
                due: endDate,
                start: startDate,
                dueReminder: reminder || null,
            })
        }
        onClose()
    }

    async function onRemove() {
        if (user && task && board) {
            const newActivity = utilService.createActivity(
                {
                    type: "removeDate",
                    targetId: task.id,
                    targetName: task.name,
                },
                user
            ) as RemoveDateActivity
            await updateBoard({
                ...board,
                activities: [...board?.activities, newActivity],
            })
            editTask({
                ...task,
                due: null,
                start: null,
                dueReminder: null,
                dueComplete: false,
            })
        }
        onClose()
    }
    function onSelectReminder(e: { id: string }) {
        setReminder(e.id)
    }

    return (
        <section className="manage-dates-content">
            <ManageTaskPopoverHeader title="Dates" close={onClose} />
            <main className="manage-dates-main">
                <header className="calendar-controller">
                    <SvgButton
                        src="/img/taskActionBtns/arrowLeftIcon.svg"
                        className="btn back-btn"
                        onClick={prevMonth}
                    />
                    <label className="label">{value.format("MMMM YYYY")}</label>
                    <SvgButton
                        src="/img/taskActionBtns/arrowLeftIcon.svg"
                        className="btn next-btn"
                        onClick={nextMonth}
                    />
                </header>
                <Calendar
                    mode="month"
                    value={value}
                    fullscreen={false}
                    onSelect={onSelect}
                    fullCellRender={cellRender}
                    headerRender={() => <div></div>}
                    locale={customLocale}
                />
                <article className="start-date">
                    <label
                        className={`section-label ${
                            focusedInput === "start" ? "selected" : ""
                        }`}
                    >
                        Start Date
                    </label>
                    <div className="input-wrapper">
                        <CheckBox
                            onChange={onStartDateCheck}
                            checked={!!startDate}
                            className="date-checkbox"
                        />
                        {!startDate && (
                            <span className="empty-date">M/D/YYYY</span>
                        )}
                        {startDate && (
                            <Input
                                ref={startDateRef}
                                className={`custom-input ${
                                    focusedInput === "start" ? "focused" : ""
                                }`}
                                value={startDateInputValue}
                                onChange={(e) =>
                                    setStartDateInputValue(e.target.value)
                                }
                                onBlur={onStartDateBlur}
                                onFocus={() => setFocusedInput("start")}
                            />
                        )}
                    </div>
                </article>
                <article className="end-date ">
                    <label
                        className={`section-label ${
                            focusedInput === "end" ? "selected" : ""
                        }`}
                    >
                        End Date
                    </label>
                    <div className="input-wrapper">
                        <CheckBox
                            onChange={onEndDateCheck}
                            checked={!!endDate}
                            className="date-checkbox"
                        />
                        {!endDate && (
                            <>
                                <span className="empty-date">M/D/YYYY</span>
                                <span className="empty-date">hh:mm a</span>
                            </>
                        )}
                        {endDate && (
                            <>
                                <Input
                                    ref={endDateRef}
                                    className={`custom-input ${
                                        focusedInput === "end" ? "focused" : ""
                                    }`}
                                    value={endDateInputValue}
                                    onChange={(e) =>
                                        setEndDateInputValue(e.target.value)
                                    }
                                    onBlur={onEndDateBlur}
                                    onFocus={() => setFocusedInput("end")}
                                />
                                <Input
                                    ref={endTimeRef}
                                    className={`custom-input ${
                                        focusedInput === "endTime"
                                            ? "focused"
                                            : ""
                                    }`}
                                    value={endTimeInputValue}
                                    onChange={(e) =>
                                        setEndTimeInputValue(e.target.value)
                                    }
                                    onBlur={onEndTimeBlur}
                                    onFocus={() => setFocusedInput("endTime")}
                                />
                            </>
                        )}
                    </div>
                </article>
                <article className="set-due-date-reminder">
                    <label
                        className={`section-label ${
                            focusedInput === "start" ? "selected" : ""
                        }`}
                    >
                        Set due date reminder
                    </label>
                    <CustomSelect
                        options={getReminderOptions(task, reminder)}
                        value={reminder}
                        onSelect={onSelectReminder}
                        optionsClassName="custom-reminder-options"
                    />
                    <p className="reminder-description">
                        Reminders will be sent to all members and watchers of
                        this card
                    </p>
                </article>
                <article className="date-btns">
                    <button className="btn save" onClick={onSave}>
                        Save
                    </button>
                    <button className="btn remove" onClick={onRemove}>
                        Remove
                    </button>
                </article>
            </main>
        </section>
    )
}

function formatDate(date: Dayjs | null) {
    return date?.format("M/D/YYYY")
}
function formatTime(date?: Dayjs | null) {
    return date?.format("hh:mm") + " " + date?.format("A")
}
function isValidDate(date?: string) {
    return dayjs(date).isValid()
}
function isValidTime(time: string) {
    return /^\d{1,2}:\d{1,2} [AP]M$/.test(time)
}
function isSameDay(date1: Dayjs | null, date2: Dayjs | null) {
    return (
        date1?.isSame(date2, "day") &&
        date1?.isSame(date2, "month") &&
        date1?.isSame(date2, "year")
    )
}
function getReminderOptions(task?: Task, reminder?: string | null) {
    return [
        { name: "None", id: "none", isCurrent: task?.dueReminder === reminder },
        {
            name: "At time due date",
            id: "at_time_due_date",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "5 Minutes before",
            id: "5_minutes_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "10 Minutes before",
            id: "10_minutes_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "15 Minutes before",
            id: "15_minutes_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "1 Hour before",
            id: "1_hour_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "2 Hours before",
            id: "2_hours_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "1 Day before",
            id: "1_day_before",
            isCurrent: task?.dueReminder === reminder,
        },
        {
            name: "2 Days before",
            id: "2_days_before",
            isCurrent: task?.dueReminder === reminder,
        },
    ]
}
