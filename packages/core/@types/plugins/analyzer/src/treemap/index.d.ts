import type { ModuleTree, ModuleTreeLeaf, SizeKey, VisualizerData } from "../../types/types";
import { HierarchyNode, TreemapLayout } from "d3-hierarchy";
import { Id } from "../uid";
import { NodeColorGetter } from "./color";
import "../style/style-treemap.scss";
export interface StaticData {
    data: VisualizerData;
    availableSizeProperties: SizeKey[];
    width: number;
    height: number;
}
export interface ModuleIds {
    nodeUid: Id;
    clipUid: Id;
}
export interface ChartData {
    layout: TreemapLayout<ModuleTree | ModuleTreeLeaf>;
    rawHierarchy: HierarchyNode<ModuleTree | ModuleTreeLeaf>;
    getModuleSize: (node: ModuleTree | ModuleTreeLeaf, sizeKey: SizeKey) => number;
    getModuleIds: (node: ModuleTree | ModuleTreeLeaf) => ModuleIds;
    getModuleColor: NodeColorGetter;
}
export declare type Context = StaticData & ChartData;
export declare const StaticContext: any;
declare const drawChart: (parentNode: Element, data: VisualizerData, width: number, height: number) => void;
export default drawChart;
