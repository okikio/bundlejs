import type { ModuleMeta, ModuleLengths, ModuleUID, SizeKey, VisualizerData } from "../../types/types";
import webcola from "webcola";
import { CssColor } from "../color";
import "../style/style-treemap.scss";
export declare type NetworkNode = NodeInfo & {
    color: CssColor;
    radius: number;
} & webcola.Node;
export declare type NetworkLink = webcola.Link<NetworkNode>;
export interface StaticData {
    data: VisualizerData;
    availableSizeProperties: SizeKey[];
    width: number;
    height: number;
}
export declare type NodeInfo = {
    uid: ModuleUID;
} & ModuleMeta & ModuleLengths;
export declare type ModuleNodeInfo = Map<ModuleUID, NodeInfo[]>;
export interface ChartData {
    nodes: Record<ModuleUID, NodeInfo>;
}
export declare type Context = StaticData & ChartData;
export declare const StaticContext: any;
declare const drawChart: (parentNode: Element, data: VisualizerData, width: number, height: number) => void;
export default drawChart;
