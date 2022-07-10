import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Component } from "solid-js";
export interface TooltipProps {
    node?: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    sizeProperty: SizeKey;
    visible: boolean;
}
export declare const Tooltip: Component<TooltipProps>;
export default Tooltip;
