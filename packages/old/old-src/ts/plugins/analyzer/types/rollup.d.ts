export type ModuleInfo = {
  renderedLength: number;
  isEntry: boolean;
  isExternal: boolean;
  importedIds: string[];
  dynamicallyImportedIds: string[];
};

export type GetModuleInfo = (moduleId: string) => ModuleInfo | null;
