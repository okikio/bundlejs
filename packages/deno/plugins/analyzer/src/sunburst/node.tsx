import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";

import { HierarchyRectangularNode } from "d3";
import color from "../color";

import { Component } from "solid-js";

type NodeEventHandler = (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;

export interface NodeProps {
  node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  onMouseOver: NodeEventHandler;
  path: string;
  highlighted: boolean;
  selected: boolean;
  onClick: NodeEventHandler;
}

export const Node: Component<NodeProps> = ({ node, onMouseOver, onClick, path, highlighted, selected }) => {
  return (
    <path
      d={path}
      fill-rule="evenodd"
      stroke="#fff"
      fill={color(node)}
      onMouseOver={(evt: MouseEvent) => {
        evt.stopPropagation();
        onMouseOver(node);
      }}
      onClick={(evt: MouseEvent) => {
        evt.stopPropagation();
        onClick(node);
      }}
      opacity={highlighted ? 1 : 0.3}
      stroke-width={selected ? 3 : undefined}
    />
  );
};
