import type { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { FunctionalComponent } from "preact";
import { HierarchyRectangularNode } from "d3-hierarchy";
export interface ChartProps {
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    sizeProperty: SizeKey;
    selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
    setSelectedNode: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined) => void;
}
export declare const Chart: FunctionalComponent<ChartProps>;
