import importModule from "@uupaa/dynamic-import-polyfill";

let supportDynamicImport = false;
try {
    let meta = import.meta;
    supportDynamicImport = true;
} catch (e) { }

export const importShim = async (id: string) => await (supportDynamicImport ? import(id) : importModule(id));