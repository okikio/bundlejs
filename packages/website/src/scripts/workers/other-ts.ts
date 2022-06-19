/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')
import type { Uri, worker } from "monaco-editor";

import { initialize } from "./worker-init";

import { createDefaultMapFromCDN, createSystem, createVirtualCompilerHost, createVirtualTypeScriptEnvironment } from "@typescript/vfs";
import * as ts from "typescript";

import { createStreaming, Formatter } from "@dprint/formatter";
import { init, build, setFile, deepAssign, deepDiff, compressToURL, getRequest, DefaultConfig } from "@bundlejs/core";

let formatter: Formatter;
let config: Record<string, unknown> | undefined = {
  // TypeScript & JavaScript config goes here
  "lineWidth": 80,
  "indentWidth": 4,
  "useTabs": false,
  "semiColons": "prefer",
  "quoteStyle": "alwaysDouble",
  "quoteProps": "preserve",
  "newLineKind": "lf",
  "useBraces": "whenNotSingleLine",
  "bracePosition": "sameLineUnlessHanging",
  "singleBodyPosition": "maintain",
  "nextControlFlowPosition": "nextLine",
  "trailingCommas": "onlyMultiLine",
  "operatorPosition": "nextLine",
  "preferHanging": false,
  "preferSingleLine": false,
  "arrowFunction.useParentheses": "maintain",
  "binaryExpression.linePerExpression": false,
  "jsx.quoteStyle": "preferDouble",
  "jsx.multiLineParens": "prefer",
  "memberExpression.linePerExpression": false,
  "typeLiteral.separatorKind": "semiColon",
  "enumDeclaration.memberSpacing": "maintain",
  "spaceSurroundingProperties": true,
  "objectExpression.spaceSurroundingProperties": true,
  "objectPattern.spaceSurroundingProperties": true,
  "typeLiteral.spaceSurroundingProperties": true,
  "binaryExpression.spaceSurroundingBitwiseAndArithmeticOperator": true,
  "commentLine.forceSpaceAfterSlashes": true,
  "constructor.spaceBeforeParentheses": false,
  "constructorType.spaceAfterNewKeyword": false,
  "constructSignature.spaceAfterNewKeyword": false,
  "doWhileStatement.spaceAfterWhileKeyword": true,
  "exportDeclaration.spaceSurroundingNamedExports": true,
  "forInStatement.spaceAfterForKeyword": true,
  "forOfStatement.spaceAfterForKeyword": true,
  "forStatement.spaceAfterForKeyword": true,
  "forStatement.spaceAfterSemiColons": true,
  "functionDeclaration.spaceBeforeParentheses": false,
  "functionExpression.spaceBeforeParentheses": false,
  "functionExpression.spaceAfterFunctionKeyword": false,
  "getAccessor.spaceBeforeParentheses": false,
  "ifStatement.spaceAfterIfKeyword": true,
  "importDeclaration.spaceSurroundingNamedImports": true,
  "jsxElement.spaceBeforeSelfClosingTagSlash": true,
  "jsxExpressionContainer.spaceSurroundingExpression": false,
  "method.spaceBeforeParentheses": false,
  "setAccessor.spaceBeforeParentheses": false,
  "taggedTemplate.spaceBeforeLiteral": true,
  "typeAnnotation.spaceBeforeColon": false,
  "typeAssertion.spaceBeforeExpression": true,
  "whileStatement.spaceAfterWhileKeyword": true,
  "ignoreNodeCommentText": "dprint-ignore",
  "ignoreFileCommentText": "dprint-ignore-file"
};

const getFormatter = async () => {
  try {
    const url = new URL("/dprint-typescript-plugin.wasm", globalThis.location.toString()).toString();
    const response = getRequest(url);
    const formatter = await createStreaming(response);
    formatter.setConfig({}, config);
    return formatter;
  } catch (err) {
    throw err;
  }
}

getFormatter().then(result => (formatter = result));

const compilerOpts: ts.CompilerOptions = {
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.ESNext,
  "lib": [
    "es2021",
    "es2020",
    "dom"
  ],
};

export interface IExtraLibs {
  [path: string]: {
    content: string;
    version: number;
  };
}

interface InlayHintsOptions {
  readonly includeInlayParameterNameHints?: 'none' | 'literals' | 'all';
  readonly includeInlayParameterNameHintsWhenArgumentMatchesName?: boolean;
  readonly includeInlayFunctionParameterTypeHints?: boolean;
  readonly includeInlayVariableTypeHints?: boolean;
  readonly includeInlayPropertyDeclarationTypeHints?: boolean;
  readonly includeInlayFunctionLikeReturnTypeHints?: boolean;
  readonly includeInlayEnumMemberValueHints?: boolean;
}

export interface ICreateData {
  compilerOptions?: ts.CompilerOptions;
  extraLibs?: IExtraLibs;
  customWorkerPath?: string;
  inlayHintsOptions?: InlayHintsOptions;
}

export class OtherTSWorker {
  // --- model sync -----------------------
  private _ctx: worker.IWorkerContext;
  private _extraLibs: IExtraLibs = Object.create(null);
  private _compilerOptions: ts.CompilerOptions;
  private _inlayHintsOptions?: InlayHintsOptions;

  constructor(ctx: worker.IWorkerContext, createData: ICreateData = {}) {
    this._ctx = ctx;
    this._compilerOptions = createData.compilerOptions;
    this._extraLibs = createData.extraLibs;
    this._inlayHintsOptions = createData.inlayHintsOptions;

    init();
  }

  async createFile(fileName, content) {
    const libFiles = import.meta.globEager('/node_modules/typescript/lib/lib.*.ts', { as: 'raw' });
    
    const fsMap = new Map<string, string>();
    // await createDefaultMapFromCDN(compilerOpts, ts.version, false, ts, lzstring, async (url: string) => { 
    //   return await getRequest(url.replace(`https://typescript.azureedge.net/cdn/${ts.version}/typescript/lib/`, `https://unpkg.com/typescript@${ts.version}/lib/`));
    // });
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

  async format(fileName, content) {
    if (!formatter) formatter = await getFormatter();
    return await Promise.resolve(formatter.formatText(fileName, content));
  }

  async getShareableURL(fileName, content, config = "{}") {
    const source = await this.createFile(fileName, content);
    config = JSON.parse(config ? config : "{}") ?? {};

    // Basically only keep the config options that have changed from the default
    let changedConfig = deepDiff(DefaultConfig, deepAssign({}, DefaultConfig, config));
    let changedEntries = Object.keys(changedConfig);

    // Collect the first few import and export statements
    let ImportExportStatements = [];
    let BackToBackImportExport = true; // Back to Back Import
    source.forEachChild(
      (node: ts.ImportDeclaration | ts.ExportDeclaration) => {
        let isImport =
          node.kind == ts.SyntaxKind.ImportDeclaration;
        let isExport =
          node.kind == ts.SyntaxKind.ExportDeclaration;
        if (!BackToBackImportExport) return;

        BackToBackImportExport = (isImport || isExport) && Boolean(node.moduleSpecifier);
        if (BackToBackImportExport) {
          let clause = isImport ?
            (node as ts.ImportDeclaration)?.importClause :
            (node as ts.ExportDeclaration)?.exportClause;

          ImportExportStatements.push({
            kind: isImport ? "import" : "export",
            clause: clause?.getText?.() ?? "*",
            module: node?.moduleSpecifier?.getText?.(),
            assert: node?.assertClause?.getText?.() ?? "",
            pos: {
              start: node.pos,
              end: node.end,
            },
          });
        }
      }
    );

    // Remove import and export statements
    let remainingCode = source.getFullText();
    [...ImportExportStatements].map(({ pos }) => {
      let { start, end } = pos;
      let snippet = remainingCode.substring(start, end);
      return snippet;
    }).forEach((snippet) => {
      remainingCode = remainingCode.replace(snippet, "");
    });

    // Collect import/export statements and create URL from them
    let modules = "";
    let treeshake = "";
    ImportExportStatements.forEach((v, i) => {
      modules +=
        (v.kind == "import" ? "(import)" : "") +
        v.module.replace(/^["']|["']$/g, "") +
        ",";

      treeshake +=
        "[" +
        v.clause
          .split(",")
          .map((s) => s.trim())
          .join(",") +
        "],";
    });

    modules = modules.replace(/,$/, "").trim();
    treeshake = treeshake.replace(/\]\,$/, "]").trim();
    remainingCode = remainingCode.trim();

    let url = new URL(self.location.origin.toString());
    if (modules.length > 0) url.searchParams.set("q", modules);
    if (treeshake.replace(/\[\*\]|\,/g, "").length > 0) {
      url.searchParams.set("treeshake", treeshake);
    }

    // If there is any remaining code convert it to a share URL
    if (remainingCode.length > 0) {
      let compressedURL = compressToURL(remainingCode);
      if (compressedURL.length > remainingCode.length)
        url.searchParams.set("text", JSON.stringify(remainingCode));
      else
        url.searchParams.set("share", compressToURL(remainingCode));
    }

    if (changedConfig && changedEntries?.length)
      url.searchParams.set("config", JSON.stringify(changedConfig));

    return decodeURIComponent(url.toString());
  }

  async build(fileName, content, config = "{}") { 
    setFile("/index.tsx", content);
    config = JSON.parse(config ? config : "{}") ?? {};
    let changedConfig = deepAssign({}, DefaultConfig, config);

    let result = await build();
    return result;
  }
};

export const connect = (port) => {
  let initialized = false;
  port.onmessage = (e) => {
    initialize(function (ctx, createData) {
      return new OtherTSWorker(ctx, createData);
    }, port, initialized);
  };
}

// @ts-ignore
self.onconnect = (e) => {
  let [port] = e.ports;
  connect(port)
}

if (!("SharedWorkerGlobalScope" in self)) {
  connect(self);
}

export { };