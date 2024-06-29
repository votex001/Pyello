import { CloseOutlined, DownOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { useEffect, useState } from "react";
import { ColorSelect } from "./ColorSelect";
import { utilService } from "../../services/util.service";
import { CustomSelect } from "./DateSelect";
import { UserAvatar } from "../UserAvatar";

//svg

import { IoFilterSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import calendarIcon from "/img/headerImgs/viewBtn-imgs/calendarIcon.svg";
import clockIcon from "/img/headerImgs/filterBtn-imgs/clockIcon.svg";
import labelIcon from "/img/headerImgs/filterBtn-imgs/labelIcon.svg";

export function FilterButton() {
  //states
  const [openListMenu, setOpenListMenu] = useState(false);
  const [isShowMoreDates, setIsShowMoreDates] = useState(false);
  //selectors
  const currentMember = useSelector((state) =>
    state.boardModule.members?.find(
      (member) => member.id === "666fe4efda8643029b6710f3"
    )
  );
  const boardLabels = useSelector(
    (state) => state.boardModule.board.labelNames
  );
  const filteredLabels =
    boardLabels &&
    Object.keys(boardLabels)
      .filter((key) => !key.includes("_"))
      .map((key) => ({ name: key, value: boardLabels[key] }));

  useEffect(() => {
    if (!openListMenu) {
      setIsShowMoreDates(false);
    }
  }, [openListMenu]);

  return (
    <Popover
      className="list-actions-menu-popover"
      trigger="click"
      placement="bottomLeft"
      open={openListMenu}
      onOpenChange={setOpenListMenu}
      arrow={false}
      content={
        <section className="filter-btn-popover">
          <header className="filter-header">
            <h2 className="filter-title">Filter</h2>
            <button
              className="close-btn"
              onClick={() => setOpenListMenu(!openListMenu)}
            >
              <span>
                <CloseOutlined />
              </span>
            </button>
          </header>

          <div className="filter-body">
            <p className="search-title">Keyword</p>
            <div>
              <input className="search-input" placeholder="Enter a key word..."/>
            </div>
            <p className="search-paragraph">Search cards, members, labels, and more.</p>
            <div>
              <p className="members-title">Members</p>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar />
                    <span title="No members">No members</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar member={currentMember} />
                    <span title="Cards assigned to me">
                      Cards assigned to me
                    </span>
                  </label>
                </li>
                <li>
                  <input type="checkbox" />
                  <CustomSelect />
                </li>
              </ul>
            </div>
            <div>
              <p>Due date</p>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar src={calendarIcon} />
                    <span title="No dates">No dates</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar
                      style={{ backgroundColor: "rgb(248, 113, 104)" }}
                      src={calendarIcon}
                    />
                    <span title="Overdue">Overdue</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar
                      style={{ backgroundColor: "rgb(245, 205, 71)" }}
                      src={calendarIcon}
                    />
                    <span title="Due in the next day">Due in the next day</span>
                  </label>
                </li>
                {!isShowMoreDates && (
                  <button onClick={() => setIsShowMoreDates(true)}>
                    Show more options{" "}
                    <DownOutlined className="showmore-arrow" />
                  </button>
                )}
                {isShowMoreDates && (
                  <>
                    <li>
                      <label>
                        <input type="checkbox" />
                        <UserAvatar src={clockIcon} />
                        <span title="Due in the next week">
                          Due in the next week
                        </span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" />
                        <UserAvatar src={clockIcon} />
                        <span title="Due in the next month">
                          Due in the next month
                        </span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" />
                        <span title="Marked as complete">
                          Marked as complete
                        </span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <input type="checkbox" />
                        <span title="Not marked as complete">
                          Not marked as complete
                        </span>
                      </label>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p>Labels</p>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" />
                    <UserAvatar src={labelIcon} />
                    <span title="No labels">No labels</span>
                  </label>
                </li>
                {filteredLabels &&
                  filteredLabels.slice(0, 3).map((label) => (
                    <li key={label.name}>
                      <label>
                        <input type="checkbox" />
                        <span
                          title={label.value}
                          style={{
                            backgroundColor: utilService.getColorHashByName(
                              label.name
                            ),
                            width: "100%",
                          }}
                          className="color-peaker"
                        >
                          {label.value}
                        </span>
                      </label>
                    </li>
                  ))}
                <li>
                  <input type="checkbox" />
                  <ColorSelect />
                </li>
              </ul>
            </div>
            <div>
              <p>Activity</p>
              <ul>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span title="Active in the last week">
                      Active in the last week
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span title="Active in the last two weeks">
                      Active in the last two weeks
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span title="Active in the last four weeks">
                      Active in the last four weeks
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" />
                    <span title="Without activity in the last four weeks">
                      Without activity in the last four weeks
                    </span>
                  </label>
                </li>
              </ul>
            </div>
            <select>
              <option value="0">Any Match</option>
              <option value="1">Exact Match</option>
            </select>
          </div>
        </section>
      }
    >
      <button className="filter-btn">
        <IoFilterSharp />
        Filters
      </button>
    </Popover>
  );
}
