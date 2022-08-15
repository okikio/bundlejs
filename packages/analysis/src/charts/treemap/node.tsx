import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { bytes } from "@bundlejs/core/src/util";
import { HierarchyRectangularNode } from "d3";
import { StaticContext } from "./index";
import { PADDING, TOP_PADDING } from "./const";
import { Component, useContext, createRenderEffect, on } from "solid-js";

type NodeEventHandler = (event: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => void;

export interface NodeProps {
  node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>;
  onMouseOver: NodeEventHandler;
  selected: boolean;
  onClick: NodeEventHandler;
}

export const Node: Component<NodeProps> = ({ node, onMouseOver, onClick, selected }) => {
  const { getModuleColor } = useContext(StaticContext);
  const { backgroundColor, fontColor } = getModuleColor(node);
  const { x0, x1, y1, y0, data, children = null } = node;

  const textRef: SVGTextElement = null;
  let textRectRef: DOMRect = null;

  const width = x1 - x0;
  const height = y1 - y0;

  const textProps: Record<string, number | string | null | undefined> = {
    "font-size": "0.7em",
    "dominant-baseline": "middle",
    "text-anchor": "middle",
    x: width / 2,
  };
  if (children != null) {
    textProps.y = (TOP_PADDING + PADDING) / 2;
  } else {
    textProps.y = height / 2;
  }

  createRenderEffect(on(
    () => [children, height, width],
    () => {
      if (width == 0 || height == 0 || !textRef) {
        return;
      }

      if (textRectRef == null) {
        textRectRef = textRef.getBoundingClientRect();
      }

      let scale = 1;
      if (children != null) {
        scale = Math.min(
          (width * 0.9) / textRectRef.width,
          Math.min(height, TOP_PADDING + PADDING) / textRectRef.height
        );
        scale = Math.min(1, scale);
        textRef.setAttribute("y", String(Math.min(TOP_PADDING + PADDING, height) / 2 / scale));
        textRef.setAttribute("x", String(width / 2 / scale));
      } else {
        scale = Math.min((width * 0.9) / textRectRef.width, (height * 0.9) / textRectRef.height);
        scale = Math.min(1, scale);
        textRef.setAttribute("y", String(height / 2 / scale));
        textRef.setAttribute("x", String(width / 2 / scale));
      }

      textRef.setAttribute("transform", `scale(${scale.toFixed(2)})`);
    }
  ));

  if (width == 0 || height == 0) {
    return null;
  }

  return (
    <g
      class="node"
      transform={`translate(${x0},${y0})`}
      onClick={(event: MouseEvent) => {
        event.stopPropagation();
        onClick(node);
      }}
      onMouseOver={(event: MouseEvent) => {
        event.stopPropagation();
        onMouseOver(node);
      }}
    >
      <rect
        fill={backgroundColor}
        rx={2}
        ry={2}
        width={x1 - x0}
        height={y1 - y0}
        stroke={selected ? "#fff" : undefined}
        stroke-width={selected ? 2 : undefined}
      ></rect>
      <text
        ref={textRef}
        fill={fontColor}
        onClick={(event: MouseEvent) => {
          if (window.getSelection()?.toString() !== "") {
            event.stopPropagation();
          }
        }}
        {...textProps}
      >
        {data.name}
      </text>
    </g>
  );
};
