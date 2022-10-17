/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')
import { createSystem, createVirtualTypeScriptEnvironment } from "@typescript/vfs";
import ts from "typescript";

import TS_LIBS_URL from "../../ts-libs.json?url";

export async function createFile(fileName: string, content: string) {  
  // const libFiles = import.meta.glob('/node_modules/typescript/lib/lib.*.ts', { as: 'raw', eager: true });
  const libFiles = await (await fetch(TS_LIBS_URL)).json();
  const compilerOpts: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    "lib": [
      "es2022",
      "es2021",
      "dom"
    ],
  };

  const fsMap = new Map<string, string>();
  const ENTRY_POINT = "index.ts";
  fsMap.set(ENTRY_POINT, "const hello = 'hi'");

  await Promise.all(
    Object.keys(libFiles).map(lib => {
      return fsMap.set(lib.replace("/node_modules/typescript/lib/", "/"), libFiles[lib] as unknown as string);
    })
  );

  fsMap.set(fileName, content);

  const system = createSystem(fsMap);
  const env = createVirtualTypeScriptEnvironment(system, [...fsMap.keys()], ts, compilerOpts);
  const program = env.languageService.getProgram();
  return program.getSourceFile(fileName);
}

export default createFile;