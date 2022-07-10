import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { group, HierarchyNode, HierarchyRectangularNode } from "d3";
import { Node } from "./node";
import { StaticContext } from "./index";
import { Component, useContext, createMemo } from "solid-js";

export interface TreeMapProps {
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  onNodeHover: (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
  selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
  onNodeClick: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;
}

export const TreeMap: Component<TreeMapProps> = ({ root, onNodeHover, selectedNode, onNodeClick }) => {
  const { width, height, getModuleIds } = useContext(StaticContext);

  console.time("layering");
  // this will make groups by height
  const nestedData = createMemo(() => {
    const nestedDataMap = group(root.descendants(), (d: HierarchyNode<ModuleTree | ModuleTreeLeaf>) => d.height);
    const nestedData = Array.from(nestedDataMap, ([key, values]) => ({
      key,
      values,
    }));
    nestedData.sort((a, b) => b.key - a.key);
    return nestedData;
  });
  console.timeEnd("layering");

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
      {nestedData().map((params) => {
        return (
          <g class="layer">
            {params.values.map((node) => {
              return (
                <Node
                  node={node as HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>}
                  onMouseOver={onNodeHover}
                  selected={selectedNode === node}
                  onClick={onNodeClick}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};
