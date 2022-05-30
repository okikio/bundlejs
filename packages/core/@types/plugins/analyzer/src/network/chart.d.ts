import { FunctionalComponent } from "preact";
import webcola from "webcola";
import type { SizeKey } from "../../types/types";
import { NetworkLink, NetworkNode } from "./index";
export interface ChartProps {
    sizeProperty: SizeKey;
    links: NetworkLink[];
    nodes: NetworkNode[];
    groups: Record<string, webcola.Group>;
}
export declare const Chart: FunctionalComponent<ChartProps>;
