import { DownOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { useState, useEffect, useRef } from "react";

export function CustomSelect({ options = [], onSelect, value, defaultValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultValue || null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(options);
  const divRef = useRef(null);
  useEffect(() => {
    onSelect(options.find((o) => o.id === value));
  }, [value]);



  useEffect(() => {
    setFilteredItems(options);
    if (options.length > 0) {
      setSelectedItem(options[0]);
    }

    if (value) {
      setSelectedItem(options.find((o) => o.id === value));
    }
  }, [options]);


  function onInput(e) {
    setSearchValue(e.target.value);

  }

  function onSelectOption(item) {

    setSelectedItem(item);
    if (onSelect) {
      onSelect(item);
    }
    setIsOpen(false);
  }

  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      open={isOpen}
      onOpenChange={setIsOpen}
      arrow={false}
      content={
        <div
          className="options"
          style={{ width: `${divRef.current?.clientWidth}px` }}
        >
          {filteredItems.map((item) => (
            <button
              key={item?.id}
              onClick={() => onSelectOption(item)}
              className={selectedItem?.name === item?.name ? "selected" : ""}
            >
              {item?.name}
            </button>
          ))}
        </div>
      }
    >
      <div
        className="custom-select-item"
        onClick={() => setIsOpen(!isOpen)}
        ref={divRef}
      >
        {
          <input
            placeholder={selectedItem?.name || defaultValue?.name}
            value={searchValue}
            onChange={onInput}
          />
        }
        <DownOutlined className="arrow-down" />
      </div>
    </Popover>
  );
}
