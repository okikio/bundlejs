import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { SideBar } from "../sidebar";
import { useFilter } from "../use-filter";
import { Chart } from "./chart";
import { StaticContext } from "./index";
import { isModuleTree } from "../../utils/is-module-tree";
import { useContext, createMemo, createSignal, Component } from "solid-js";

export const Main: Component = () => {
  const { availableSizeProperties, rawHierarchy, getModuleSize, layout, data } = useContext(StaticContext);
  const [sizeProperty, setSizeProperty] = createSignal<SizeKey>(availableSizeProperties[0]);
  const [selectedNode, setSelectedNode] = createSignal<HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined>(
    undefined
  );

  const { getModuleFilterMultiplier, setExcludeFilter, setIncludeFilter } = useFilter();
  const getNodeSizeMultiplier = createMemo(() => {
    if (selectedNode() === undefined) {
      return (): number => 1;
    } else if (isModuleTree(selectedNode().data)) {
      const descendants = new Set(selectedNode().descendants().map((d) => d.data));
      return (node: ModuleTree | ModuleTreeLeaf): number => {
        if (descendants.has(node)) {
          return 3;
        }
        return 1;
      };
    } else {
      return (node: ModuleTree | ModuleTreeLeaf): number => {
        if (node === selectedNode().data) {
          return 3;
        }
        return 1;
      };
    }
  });

  // root here always be the same as rawHierarchy even after layouting
  const root = createMemo(() => {
    const rootWithSizesAndSorted = rawHierarchy
      .sum((node) => {
        if (isModuleTree(node)) return 0;
        const ownSize = getModuleSize(node, sizeProperty());
        const zoomMultiplier = getNodeSizeMultiplier()(node);
        const filterMultiplier = getModuleFilterMultiplier(data.nodeMetas[data.nodeParts[node.uid].mainUid]);

        return ownSize * zoomMultiplier * filterMultiplier;
      })
      .sort((a, b) => getModuleSize(a.data, sizeProperty()) - getModuleSize(b.data, sizeProperty()));

    return layout(rootWithSizesAndSorted);
  });

  return (
    <>
      <SideBar
        sizeProperty={sizeProperty()}
        availableSizeProperties={availableSizeProperties}
        setSizeProperty={setSizeProperty}
        onExcludeChange={setExcludeFilter}
        onIncludeChange={setIncludeFilter}
      />
      <Chart root={root()} sizeProperty={sizeProperty()} selectedNode={selectedNode()} setSelectedNode={setSelectedNode} />
    </>
  );
};
