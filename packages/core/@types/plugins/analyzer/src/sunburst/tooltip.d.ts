import type { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { FunctionalComponent } from "preact";
import { HierarchyRectangularNode } from "d3-hierarchy";
export interface TooltipProps {
    node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    sizeProperty: SizeKey;
}
export declare const Tooltip: FunctionalComponent<TooltipProps>;
