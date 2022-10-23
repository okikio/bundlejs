/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')
import TS_LIBS_URL from "../../ts-libs.json?url";
import { createSystem, createVirtualTypeScriptEnvironment, knownLibFilesForCompilerOptions } from "@typescript/vfs";
import ts from "typescript";

import { getRequest } from "@bundlejs/core/src/util";

export async function createFile(fileName: string, content: string) {  
  const libFiles: Record<string, string> = await (await getRequest(TS_LIBS_URL, true)).json();
  const compilerOpts: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    "lib": [
      "es2022",
      "es2021",
      "dom"
    ],
  };

  const libs = knownLibFilesForCompilerOptions(compilerOpts, ts);
  const fsMap = new Map<string, string>();  
  for (const path of libs) {
    fsMap.set(`/${path}`, libFiles[path]);
  }

  fsMap.set(fileName, content);

  const system = createSystem(fsMap);
  const env = createVirtualTypeScriptEnvironment(system, [...fsMap.keys()], ts, compilerOpts);
  const program = env.languageService.getProgram();
  return program.getSourceFile(fileName);
}

export default createFile;