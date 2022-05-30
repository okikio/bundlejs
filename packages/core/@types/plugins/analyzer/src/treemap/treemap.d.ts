import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { FunctionalComponent } from "preact";
import { HierarchyRectangularNode } from "d3-hierarchy";
export interface TreeMapProps {
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    onNodeHover: (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
    selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
    onNodeClick: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
}
export declare const TreeMap: FunctionalComponent<TreeMapProps>;
