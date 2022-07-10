import { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Component } from "solid-js";
export interface SunBurstProps {
    root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    onNodeHover: (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
    isNodeHighlighted: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => boolean;
    selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
    onNodeClick: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
}
export declare const SunBurst: Component<SunBurstProps>;
