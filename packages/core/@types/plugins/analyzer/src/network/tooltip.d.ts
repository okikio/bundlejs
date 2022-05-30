import type { SizeKey } from "../../types/types";
import { FunctionalComponent } from "preact";
import { NetworkNode } from "./index";
export interface TooltipProps {
    node?: NetworkNode;
    sizeProperty: SizeKey;
    visible: boolean;
}
export declare const Tooltip: FunctionalComponent<TooltipProps>;
