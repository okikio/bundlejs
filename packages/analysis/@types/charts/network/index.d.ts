import { ModuleMeta, ModuleLengths, ModuleUID, SizeKey, VisualizerData } from "../../types/types";
import webcola from "webcola";
import { CssColor } from "../color";
import "../style/style-treemap.scss";
export type NetworkNode = NodeInfo & {
    color: CssColor;
    radius: number;
} & webcola.Node;
export type NetworkLink = webcola.Link<NetworkNode>;
export interface StaticData {
    data: VisualizerData;
    availableSizeProperties: SizeKey[];
    width: number;
    height: number;
}
export type NodeInfo = {
    uid: ModuleUID;
} & ModuleMeta & ModuleLengths;
export type ModuleNodeInfo = Map<ModuleUID, NodeInfo[]>;
export interface ChartData {
    nodes: Record<ModuleUID, NodeInfo>;
}
export type Context = StaticData & ChartData;
export declare const StaticContext: import("solid-js").Context<Context>;
declare const drawChart: (parentNode: Element, data: VisualizerData, width: number, height: number) => void;
export default drawChart;
