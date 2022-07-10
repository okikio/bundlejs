import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Component } from "solid-js";
declare type NodeEventHandler = (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
export interface NodeProps {
    node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    onMouseOver: NodeEventHandler;
    path: string;
    highlighted: boolean;
    selected: boolean;
    onClick: NodeEventHandler;
}
export declare const Node: Component<NodeProps>;
export {};
