import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { FunctionalComponent } from "preact";
import { HierarchyRectangularNode } from "d3-hierarchy";
declare type NodeEventHandler = (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
export interface NodeProps {
    node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
    onMouseOver: NodeEventHandler;
    path: string;
    highlighted: boolean;
    selected: boolean;
    onClick: NodeEventHandler;
}
export declare const Node: FunctionalComponent<NodeProps>;
export {};
