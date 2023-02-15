import type { ModuleTree, ModuleTreeLeaf } from "../../types/types";
import { CssColor } from "../color";
import { HierarchyNode } from "d3";
export interface NodeColor {
    backgroundColor: CssColor;
    fontColor: CssColor;
}
export type NodeColorGetter = (node: HierarchyNode<ModuleTree | ModuleTreeLeaf>) => NodeColor;
declare const createRainbowColor: (root: HierarchyNode<ModuleTree | ModuleTreeLeaf>) => NodeColorGetter;
export default createRainbowColor;
