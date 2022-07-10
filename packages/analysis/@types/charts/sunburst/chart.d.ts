import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Component } from "solid-js";
export interface ChartProps {
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    sizeProperty: SizeKey;
    selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
    setSelectedNode: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined) => void;
}
export declare const Chart: Component<ChartProps>;
