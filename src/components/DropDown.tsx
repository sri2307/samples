import React, { useEffect, useRef, useState } from "react";
import {
  Action,
  DropDownItem,
  DropDownProps,
} from "../types/DropDownInterface";

const DropDown = ({ data, onSelect }: DropDownProps) => {
  const [toggle, setToggle] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { menu, hasSearch, hasMultiSelect } = data;
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const getButtonText = () => {
    if (selectedItems.length === 0) {
      return "Choose Item";
    } else if (hasMultiSelect) {
      const selectedLabels = selectedItems
        .map((id) => menu.find((item) => item.id === id)?.label)
        .filter(Boolean);
      const displayLabels = selectedLabels.join(", ");
      return selectedLabels.length > 0
        ? truncateWithEllipsis(displayLabels, 20) // Adjust '20' based on button size
        : "Choose Item";
    } else {
      // Single select
      const selectedItem = menu.find((item) => selectedItems.includes(item.id));
      return selectedItem ? selectedItem.label : "Choose Item";
    }
  };

  function truncateWithEllipsis(text: string, maxLength: number) {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  }
  const handleSelect = (itemId: number) => {
    setSelectedItems((prevItems) => {
      // 'prevItems' exists within this scope
      const updatedSelectedItems = hasMultiSelect
        ? prevItems.includes(itemId)
          ? prevItems.filter((id) => id !== itemId)
          : [...prevItems, itemId]
        : prevItems.includes(itemId)
        ? prevItems.filter((id) => id !== itemId)
        : [itemId];

      // Notify parent component (if onSelect is provided)
      if (onSelect) {
        onSelect(
          updatedSelectedItems.map((id) => menu.find((item) => item.id === id)!)
        );
      }
      return updatedSelectedItems; // Return the updated state for internal use
    });

    if (!hasMultiSelect) {
      setToggle(false); // Close dropdown after single selection
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setToggle(false); // Close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]); 

  
const handleClickAction = (event: React.MouseEvent, action: Action, item: DropDownItem) => {
    event.stopPropagation();

    if (action.onClick) {
        action.onClick(item); 
    } else {
        console.error('Action does not have an onClick handler:', action);
    }
};

  return (
    <>
      <div className="dropdown" ref={dropdownRef}>
        <button
          className="dropdown-button"
          onClick={() => setToggle((state) => !state)}
        >
          <span>{getButtonText()}</span>
          {toggle?<span className="icon">&and;</span>:
          <span className="icon">&or;</span>}
        </button>
        <ul className={`${toggle ? "" : "hide"}`}>
          {hasSearch && <input type="search" placeholder="Search" />}
          {menu.map((item) => (
            <li key={item.id} onClick={() => handleSelect(item.id)}>
              <div className="item-content">
                {" "}
                {hasMultiSelect && (
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                  />
                )}
                <span>{item.label}</span>
              </div>
              <div className="actions">
                {item.actions.map((action, index) => (
                  <span
                    key={index}
                    onClick={(e) => handleClickAction(e, action, item)}
                  >
                    { action.content}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DropDown;
