import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { TreeMap } from "./treemap";
import { Tooltip } from "./tooltip";

import { Component, createSignal } from "solid-js";
import { onMountWithCleaning } from "../../utils/onMountWithCleaning";

export interface ChartProps {
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  sizeProperty: SizeKey;
  selectedNode: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined;
  setSelectedNode: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined) => void;
}

export const Chart: Component<ChartProps> = ({ root, sizeProperty, selectedNode, setSelectedNode }) => {
  const [showTooltip, setShowTooltip] = createSignal<boolean>(false);
  const [tooltipNode, setTooltipNode] = createSignal<HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined>(
    undefined
  );

  onMountWithCleaning(() => {
    const handleMouseOut = () => {
      setShowTooltip(false);
    };

    document.addEventListener("mouseover", handleMouseOut);
    return () => {
      document.removeEventListener("mouseover", handleMouseOut);
    };
  });

  return (
    <>
      <TreeMap
        root={root}
        onNodeHover={(node) => {
          setTooltipNode(node);
          setShowTooltip(true);
        }}
        selectedNode={selectedNode}
        onNodeClick={(node) => {
          setSelectedNode(selectedNode === node ? undefined : node);
        }}
      />
      <Tooltip visible={showTooltip()} node={tooltipNode()} root={root} sizeProperty={sizeProperty} />
    </>
  );
};
