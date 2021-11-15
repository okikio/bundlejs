// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')

import type { CustomTSWebWorkerFactory } from "../../../node_modules/monaco-editor/esm/vs/language/typescript/tsWorker.js";
import { setupTypeAcquisition } from "@typescript/ata";

// @ts-ignore
import prettier from "prettier/esm/standalone.mjs";
// @ts-ignore
import parserBabel from "prettier/esm/parser-babel.mjs";

import { compressToURL } from "@amoutonbrady/lz-string";
import ts from "typescript";

const formatCode = async (code: string) => {
    return prettier.format(code, {
        parser: "babel-ts",
        plugins: [parserBabel],
    });
};


const worker: CustomTSWebWorkerFactory = (TypeScriptWorker) => {
    return class MonacoTSWorker extends TypeScriptWorker {
        async typeAcquisition(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);

            const extraLib = new Map<string, string>();
            const TypeAquisition = setupTypeAcquisition({
                projectName: "My ATA Project",
                typescript: ts,
                logger: console,
                delegate: {
                    receivedFile: (code: string, path: string) => {
                        // Add code to your runtime at the path...
                        extraLib.set(path, code);
                    },
                    started: () => {
                        console.log("ATA start")
                    },
                    progress: (downloaded: number, total: number) => {
                        console.log(`Got ${downloaded} out of ${total}`)
                    },
                    finished: vfs => {
                        console.log("ATA done", Array.from(vfs.keys()))
                        this.updateExtraLibs(Object.entries(extraLib).map(([k, v]) => {
                            return ({ filePath: k, content: v });
                        }));
                    },
                },
            });

            TypeAquisition(source.getFullText());
        }

        async format(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);
            return await formatCode(source.getFullText());
        }

        async getShareableURL(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);

            // Collect the first few import and export statements
            let ImportExportStatements = [];
            let BackToBackImportExport = true; // Back to Back Import
            ts.forEachChild(
                source,
                (node: ts.ImportDeclaration | ts.ExportDeclaration) => {
                    let isImport =
                        node.kind == ts.SyntaxKind["ImportDeclaration"];
                    let isExport =
                        node.kind == ts.SyntaxKind["ExportDeclaration"];
                    if (!BackToBackImportExport) return;

                    BackToBackImportExport = isImport || isExport;
                    if (isImport || isExport) {
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
            if (treeshake.length > 0)
                url.searchParams.set("treeshake", treeshake);

            // If there is any remaining code convert it to a share URL
            if (remainingCode.length > 0)
                url.searchParams.set("share", compressToURL(remainingCode));
            return decodeURIComponent(url.toString());
        }
    };
};

// @ts-ignore
self.customTSWorkerFactory = worker;
