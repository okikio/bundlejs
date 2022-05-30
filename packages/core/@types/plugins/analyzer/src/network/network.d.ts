import { FunctionalComponent } from "preact";
import webcola from "webcola";
import { NetworkLink, NetworkNode } from "./index";
export interface NetworkProps {
    onNodeHover: (event: NetworkNode) => void;
    nodes: NetworkNode[];
    links: NetworkLink[];
    groups: Record<string, webcola.Group>;
}
export declare const Network: FunctionalComponent<NetworkProps>;
