import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { Tooltip } from "./tooltip";
import { SunBurst } from "./sunburst";

import { createSignal, createMemo, Component, on } from "solid-js";
import { createEffectWithCleaning } from "../../utils/createEffectWithCleaning";

export interface ChartProps {
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  sizeProperty: SizeKey;
  selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
  setSelectedNode: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined) => void;
}

type NodeSelectHandler = (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => boolean;

export const Chart: Component<ChartProps> = ({ root, sizeProperty, selectedNode, setSelectedNode }) => {
  const [tooltipNode, setTooltipNode] = createSignal(root);

  const isNodeHighlighted = createMemo<NodeSelectHandler>(() => {
    const highlightedNodes = new Set(tooltipNode() === root ? root.descendants() : tooltipNode().ancestors());
    return (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>): boolean => {
      return highlightedNodes.has(node);
    };
  });

  // @ts-ignore
  createEffectWithCleaning(on(
    () => [root],
    () => {
      const handleMouseOut = () => {
        setTooltipNode(root);
      };

      handleMouseOut();
      document.addEventListener("mouseover", handleMouseOut);

      return () => {
        document.removeEventListener("mouseover", handleMouseOut)
      };
    }
  ));

  return (
    <>
      <SunBurst
        root={root}
        onNodeHover={(node) => {
          setTooltipNode(node);
        }}
        isNodeHighlighted={isNodeHighlighted()}
        selectedNode={selectedNode}
        onNodeClick={(node) => {
          setSelectedNode(selectedNode === node ? undefined : node);
        }}
      />
      <Tooltip node={tooltipNode()} root={root} sizeProperty={sizeProperty} />
    </>
  );
};
