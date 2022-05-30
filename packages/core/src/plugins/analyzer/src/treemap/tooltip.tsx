import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { format as formatBytes } from "bytes";
import { LABELS } from "../sizes";
import { HierarchyRectangularNode } from "d3";
import { StaticContext } from "./index";
import { isModuleTree } from "../../utils/is-module-tree";

import { Component, createSignal, createMemo, useContext } from "solid-js";
import onMountWithCleaning from "../../utils/onMountWithCleaning";

export interface TooltipProps {
  node?: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  root: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  sizeProperty: SizeKey;
  visible: boolean;
}

const Tooltip_marginX = 10;
const Tooltip_marginY = 30;

const RENDRED = (
  <span>
    <b>{LABELS.renderedLength}</b> is a byte size of individual file after transformations and treeshake.
  </span>
);

const COMPRESSED = (
  <span>
    <b>{LABELS.gzipLength}</b> and <b>{LABELS.brotliLength}</b> is a byte size of individual file after individual{" "}
    transformations,
    <br /> treeshake and compression.
  </span>
);

export const Tooltip: Component<TooltipProps> = ({ node, visible, root, sizeProperty }) => {
  const { availableSizeProperties, getModuleSize, data } = useContext(StaticContext);

  const ref: HTMLDivElement = null;
  const [style, setStyle] = createSignal({});

  const content = createMemo(() => {
    if (!node) return null;

    const mainSize = getModuleSize(node.data, sizeProperty);

    const percentageNum = (100 * mainSize) / getModuleSize(root.data, sizeProperty);
    const percentage = percentageNum.toFixed(2);
    const percentageString = percentage + "%";

    const path = node
      .ancestors()
      .reverse()
      .map((d) => d.data.name)
      .join("/");

    let dataNode = null;
    if (!isModuleTree(node.data)) {
      const mainUid = data.nodeParts[node.data.uid].mainUid;
      dataNode = data.nodeMetas[mainUid];
    }

    return (
      <>
        <div>{path}</div>
        {availableSizeProperties.map((sizeProp) => {
          if (sizeProp === sizeProperty) {
            return (
              <div>
                <b>
                  {LABELS[sizeProp]}: {formatBytes(mainSize)}
                </b>{" "}
                ({percentageString})
              </div>
            );
          } else {
            return (
              <div>
                {LABELS[sizeProp]}: {formatBytes(getModuleSize(node.data, sizeProp))}
              </div>
            );
          }
        })}
        <br />
        {dataNode && dataNode.importedBy.length > 0 && (
          <div>
            <div>
              <b>Imported By</b>:
            </div>
            {dataNode.importedBy.map((params) => {
              const id = data.nodeMetas[params.uid].id;
              return <div>{id}</div>;
            })}
          </div>
        )}
        <br />
        <small>{RENDRED}</small>
        {(data.options.gzip || data.options.brotli) && (
          <>
            <br />
            <small>{COMPRESSED}</small>
          </>
        )}
      </>
    );
  });

  const updatePosition = (mouseCoords: { x: number; y: number }) => {
    if (!ref) return;

    const pos = {
      left: mouseCoords.x + Tooltip_marginX,
      top: mouseCoords.y + Tooltip_marginY,
    };

    const boundingRect = ref.getBoundingClientRect();

    if (pos.left + boundingRect.width > window.innerWidth) {
      // Shifting horizontally
      pos.left = window.innerWidth - boundingRect.width;
    }

    if (pos.top + boundingRect.height > window.innerHeight) {
      // Flipping vertically
      pos.top = mouseCoords.y - Tooltip_marginY - boundingRect.height;
    }

    setStyle(pos);
  };

  onMountWithCleaning(() => {
    const handleMouseMove = (event: MouseEvent) => {
      updatePosition({
        x: event.pageX,
        y: event.pageY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove, true);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
    };
  });

  return (
    <div class={`tooltip ${visible ? "" : "tooltip-hidden"}`} ref={ref} style={style()}>
      {content()}
    </div>
  );
};

export default Tooltip;
