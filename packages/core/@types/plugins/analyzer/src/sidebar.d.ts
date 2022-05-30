import type { SizeKey } from "../types/types";
import { FunctionalComponent } from "preact";
export interface SideBarProps {
    availableSizeProperties: SizeKey[];
    sizeProperty: SizeKey;
    setSizeProperty: (key: SizeKey) => void;
    onExcludeChange: (value: string) => void;
    onIncludeChange: (value: string) => void;
}
export declare const SideBar: FunctionalComponent<SideBarProps>;
