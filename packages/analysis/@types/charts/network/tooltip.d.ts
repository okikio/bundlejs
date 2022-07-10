import { SizeKey } from "../../types/types";
import { Component } from "solid-js";
import { NetworkNode } from "./index";
export interface TooltipProps {
    node?: NetworkNode;
    sizeProperty: SizeKey;
    visible: boolean;
}
export declare const Tooltip: Component<TooltipProps>;
