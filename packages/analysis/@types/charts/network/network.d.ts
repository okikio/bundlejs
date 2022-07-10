import webcola from "webcola";
import { NetworkLink, NetworkNode } from "./index";
import { Component } from "solid-js";
export interface NetworkProps {
    onNodeHover: (event: NetworkNode) => void;
    nodes: NetworkNode[];
    links: NetworkLink[];
    groups: Record<string, webcola.Group>;
}
export declare const Network: Component<NetworkProps>;
