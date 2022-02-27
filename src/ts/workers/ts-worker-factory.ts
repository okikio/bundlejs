/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')

// import { setupTypeAcquisition } from "@typescript/ata";

import { createStreaming, Formatter } from "@dprint/formatter";
import { compressToURL } from "@amoutonbrady/lz-string";
import type ts from "typescript";
import { sign } from "crypto";

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
const abortController = new AbortController();
const signal = abortController.signal;
const getFormatter = async () => {
    try {
        const url = new URL("/dprint-typescript-plugin.wasm", globalThis.location.toString()).toString();
        const response = fetch(url, { signal });
        const formatter = await createStreaming(response);
        formatter.setConfig({}, config);
        return formatter;
    } catch (err) {
        if (!signal.aborted)
            throw err;
    }
}

getFormatter().then(result => (formatter = result));

const SyntaxKind = {
    ImportDeclaration: 265 as ts.SyntaxKind.ImportDeclaration,
    ExportDeclaration: 271 as ts.SyntaxKind.ExportDeclaration,
};

const worker = (TypeScriptWorker, fileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {
        async typeAcquisition(fileName) {
            // const program = this._languageService.getProgram() as ts.Program;
            // const source = program.getSourceFile(fileName);

            // const extraLib = new Map<string, string>();
            // const TypeAquisition = setupTypeAcquisition({
            //     projectName: "My ATA Project",
            //     typescript: ts,
            //     logger: console,
            //     delegate: {
            //         receivedFile: (code: string, path: string) => {
            //             // Add code to your runtime at the path...
            //             extraLib.set(path, code);
            //         },
            //         started: () => {
            //             console.log("ATA start")
            //         },
            //         progress: (downloaded: number, total: number) => {
            //             console.log(`Got ${downloaded} out of ${total}`)
            //         },
            //         finished: vfs => {
            //             console.log("ATA done", Array.from(vfs.keys()))
            //             this.updateExtraLibs(Object.entries(extraLib).map(([k, v]) => {
            //                 return ({ filePath: k, content: v });
            //             }));
            //         },
            //     },
            // });

            // TypeAquisition(source.getFullText());
        }

        async format(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);
            if (!formatter) formatter = await getFormatter();
            return await Promise.resolve(formatter.formatText(fileName, source.getFullText()));
        }

        async getShareableURL(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);

            // Collect the first few import and export statements
            let ImportExportStatements = [];
            let BackToBackImportExport = true; // Back to Back Import
            source.forEachChild(
                (node: ts.ImportDeclaration | ts.ExportDeclaration) => {
                    let isImport =
                        node.kind == SyntaxKind.ImportDeclaration - 1;
                    let isExport =
                        node.kind == SyntaxKind.ExportDeclaration - 1;
                    if (!BackToBackImportExport) return;

                    BackToBackImportExport = isImport || isExport || Boolean(node.moduleSpecifier);
                    if (BackToBackImportExport) {
                        ImportExportStatements.push({
                            kind: isImport ? "import" : "export",
                            clause:
                                (isImport
                                    ? (node as ts.ImportDeclaration)
                                        .importClause
                                    : (node as ts.ExportDeclaration)
                                        .exportClause
                                )?.getText() ?? "*",
                            module: node.moduleSpecifier.getText(),
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
            ImportExportStatements.map(({ pos }) => {
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
                        .join("") +
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
                // console.log(remainingCode, compressedURL)
                if (compressedURL.length > remainingCode.length)
                    url.searchParams.set("text", JSON.stringify(remainingCode));
                else
                    url.searchParams.set("share", compressToURL(remainingCode));
            }
            return decodeURIComponent(url.toString());
        }
    };
};

// @ts-ignore
self.customTSWorkerFactory = worker;
