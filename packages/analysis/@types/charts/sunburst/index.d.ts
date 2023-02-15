import { ModuleTree, ModuleTreeLeaf, SizeKey, VisualizerData } from "../../types/types";
import { HierarchyNode, HierarchyRectangularNode, PartitionLayout, Arc } from "d3";
import { Id } from "../uid";
import "../style/style-sunburst.scss";
export interface StaticData {
    data: VisualizerData;
    availableSizeProperties: SizeKey[];
    width: number;
    height: number;
}
export interface ModuleIds {
    nodeUid: Id;
}
export interface ChartData {
    layout: PartitionLayout<ModuleTree | ModuleTreeLeaf>;
    rawHierarchy: HierarchyNode<ModuleTree | ModuleTreeLeaf>;
    getModuleSize: (node: ModuleTree | ModuleTreeLeaf, sizeKey: SizeKey) => number;
    getModuleIds: (node: ModuleTree | ModuleTreeLeaf) => ModuleIds;
    size: number;
    radius: number;
    arc: Arc<any, HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>>;
}
export type Context = StaticData & ChartData;
export declare const StaticContext: import("solid-js").Context<Context>;
declare const drawChart: (parentNode: Element, data: VisualizerData, width: number, height: number) => void;
export default drawChart;
