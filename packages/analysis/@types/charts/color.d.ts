import type { ModuleTree, ModuleTreeLeaf } from "../types/types";
import { HierarchyRectangularNode } from "d3";
export declare type CssColor = string;
export declare const COLOR_DEFAULT_FILE: CssColor;
export declare const COLOR_DEFAULT_OWN_SOURCE: CssColor;
export declare const COLOR_DEFAULT_VENDOR_SOURCE: CssColor;
export declare const COLOR_BASE: CssColor;
declare const colorDefault: (node: HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf>) => CssColor;
export default colorDefault;
