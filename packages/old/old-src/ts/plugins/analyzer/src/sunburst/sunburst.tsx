import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";

import { h, FunctionalComponent } from "preact";
import { HierarchyRectangularNode } from "d3";
import { useContext } from "preact/hooks";
import { StaticContext } from "./index";

import { Node } from "./node";

export interface SunBurstProps {
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  onNodeHover: (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
  isNodeHighlighted: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => boolean;
  selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
  onNodeClick: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
}

export const SunBurst: FunctionalComponent<SunBurstProps> = ({
  root,
  onNodeHover,
  isNodeHighlighted,
  selectedNode,
  onNodeClick,
}) => {
  const { getModuleIds, size, arc, radius } = useContext(StaticContext);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${radius},${radius})`}>
        {root.descendants().map((node) => {
          return (
            <Node
              key={getModuleIds(node.data).nodeUid.id}
              node={node}
              onMouseOver={onNodeHover}
              path={arc(node) as string}
              highlighted={isNodeHighlighted(node)}
              selected={selectedNode === node}
              onClick={onNodeClick}
            />
          );
        })}
      </g>
    </svg>
  );
};