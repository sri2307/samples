export interface Action {
    content: string | JSX.Element; 
    onClick: (item: DropDownItem) => void;
}
export interface DropDownItem {
    label: string;
    id: number;
    actions: Action[];
  }
  export interface DropDown {
    menu: DropDownItem[];
    hasSearch?: boolean;
    hasMultiSelect: boolean;
  }

export interface DropDownProps {
    data: DropDown; 
    onSelect?: (selectedItems: DropDownItem[]) => void; // Optional callback for selection changes
}