import type { ModuleTree, ModuleTreeLeaf } from "../types/types";

export const isModuleTree = (mod: ModuleTree | ModuleTreeLeaf): mod is ModuleTree => "children" in mod;