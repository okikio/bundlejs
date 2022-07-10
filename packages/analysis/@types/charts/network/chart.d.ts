import webcola from "webcola";
import { SizeKey } from "../../types/types";
import { NetworkLink, NetworkNode } from "./index";
import { Component } from "solid-js";
export interface ChartProps {
    sizeProperty: SizeKey;
    links: NetworkLink[];
    nodes: NetworkNode[];
    groups: Record<string, webcola.Group>;
}
export declare const Chart: Component<ChartProps>;
