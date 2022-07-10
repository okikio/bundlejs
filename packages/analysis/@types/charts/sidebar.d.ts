import { SizeKey } from "../types/types";
import { Component } from "solid-js";
export interface SideBarProps {
    availableSizeProperties: SizeKey[];
    sizeProperty: SizeKey;
    setSizeProperty: (key: SizeKey) => void;
    onExcludeChange: (value: string) => void;
    onIncludeChange: (value: string) => void;
}
export declare const SideBar: Component<SideBarProps>;
