import { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Component } from "solid-js";
type NodeEventHandler = (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
export interface NodeProps {
    node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    onMouseOver: NodeEventHandler;
    selected: boolean;
    onClick: NodeEventHandler;
}
export declare const Node: Component<NodeProps>;
export {};
