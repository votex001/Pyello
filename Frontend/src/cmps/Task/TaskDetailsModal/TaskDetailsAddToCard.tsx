import fieldsIcon from "/img/board-index/detailsImgs/fieldsIcon.svg"
import { ManageDatesPopover } from "../ManageTaskPopovers/ManageDatesPopover"
import { ManageAttachmentsPopover } from "../ManageTaskPopovers/ManageAttachmentsPopover"
import { ManageMembersPopover } from "../ManageTaskPopovers/ManageMembersPopover"
import { ManageLabelsPopover } from "../ManageTaskPopovers/ManageLabelsPopover"
import { ManageCoverPopover } from "../ManageTaskPopovers/ManageCoverPopover"
import { AddChecklistPopover } from "../ManageTaskPopovers/AddChecklistPopover"
import { Task } from "../../../models/task&groups.models"

interface TaskDetailsAddToCardProps {
    task?: Task
    isNoCover: boolean
}

export function TaskDetailsAddToCard({
    task,
    isNoCover,
}: TaskDetailsAddToCardProps) {
    const addToCard = [
        {
            popover: (
                <ManageMembersPopover
                    anchorEl={
                        <button className="details-anchor-btn">
                            <label className="pyello-icon icon-member " />
                            <label className="btn-label">Members</label>
                        </button>
                    }
                    task={task}
                />
            ),
        },
        {
            popover: (
                <ManageLabelsPopover
                    anchorEl={
                        <button className="details-anchor-btn">
                            <label className="pyello-icon icon-label " />
                            <label className="btn-label">Labels</label>
                        </button>
                    }
                    task={task}
                />
            ),
        },
        {
            popover: (
                <AddChecklistPopover
                    anchorEl={
                        <label className="details-anchor-btn">
                            <label className="pyello-icon icon-checklist " />
                            <label className="btn-label">Checklists</label>
                        </label>
                    }
                    task={task}
                />
            ),
        },
        {
            popover: (
                <ManageDatesPopover
                    task={task}
                    anchorEl={
                        <button className="details-anchor-btn">
                            <label className="pyello-icon icon-clock " />
                            <label className="btn-label">Dates</label>
                        </button>
                    }
                />
            ),
        },
        {
            popover: (
                <ManageAttachmentsPopover
                    task={task}
                    anchorEl={
                        <button className="details-anchor-btn">
                            <label className="pyello-icon icon-attachment " />
                            <label className="btn-label">Attachments</label>
                        </button>
                    }
                />
            ),
        },
        {
            popover: (
                <ManageCoverPopover
                    anchorEl={
                        <button
                            className={`details-anchor-btn ${
                                !isNoCover ? "no-cover" : ""
                            }`}
                            style={{ width: "100%" }}
                        >
                            <label className="pyello-icon icon-card-cover " />
                            <label className="btn-label">Cover</label>
                        </button>
                    }
                    task={task}
                    isFullWidth={true}
                />
            ),
        },
        { svg: fieldsIcon, text: "Custom Fields" },
    ]
    return (
        <section className="tittle">
            <p className="sub-title">Add to card</p>
            {addToCard.map((btn, index) => (
                <div key={index}>{btn.popover}</div>
            ))}
        </section>
    )
}
