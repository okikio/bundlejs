import webcola from "webcola";
import { SizeKey } from "../../types/types";
import { Tooltip } from "./tooltip";
import { Network } from "./network";
import { NetworkLink, NetworkNode } from "./index";
import { Component, createSignal } from "solid-js";
import { onMountWithCleaning } from "../../utils/onMountWithCleaning";

export interface ChartProps {
  sizeProperty: SizeKey;
  links: NetworkLink[];
  nodes: NetworkNode[];
  groups: Record<string, webcola.Group>;
}

export const Chart: Component<ChartProps> = ({ sizeProperty, links, nodes, groups }) => {
  const [showTooltip, setShowTooltip] = createSignal<boolean>(false);
  const [tooltipNode, setTooltipNode] = createSignal<NetworkNode | undefined>(undefined);

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
      <Network
        links={links}
        nodes={nodes}
        groups={groups}
        onNodeHover={(node) => {
          setTooltipNode(node);
          setShowTooltip(true);
        }}
      />
      <Tooltip visible={showTooltip()} node={tooltipNode()} sizeProperty={sizeProperty} />
    </>
  );
};
