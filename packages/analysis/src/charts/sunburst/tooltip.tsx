import type { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { bytes } from "@bundle/utils/utils/pretty-bytes.ts";
import type { HierarchyRectangularNode } from "d3";
import { LABELS } from "../sizes";
import { StaticContext } from "./index";
import { useContext, createMemo, type Component } from "solid-js";

export interface TooltipProps {
  node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  sizeProperty: SizeKey;
}

export const Tooltip: Component<TooltipProps> = ({ node, root, sizeProperty }) => {
  const { availableSizeProperties, getModuleSize } = useContext(StaticContext);

  const content = createMemo(() => {
    if (!node) return null;

    const mainSize = getModuleSize(node.data, sizeProperty);

    const percentageNum = (100 * mainSize) / getModuleSize(root.data, sizeProperty);
    const percentage = percentageNum.toFixed(2);
    const percentageString = percentage + "%";

    return (
      <>
        <div class="details-name">{node.data.name}</div>
        <div class="details-percentage">{percentageString}</div>
        {availableSizeProperties.map((sizeProp) => {
          if (sizeProp === sizeProperty) {
            return (
              <div class="details-size">
                <b>
                  {LABELS[sizeProp]}: {bytes(getModuleSize(node.data, sizeProp))}
                </b>
              </div>
            );
          } else {
            return (
              <div class="details-size">
                {LABELS[sizeProp]}: {bytes(getModuleSize(node.data, sizeProp))}
              </div>
            );
          }
        })}
      </>
    );
  });

  return <div class="details">{content()}</div>;
};
