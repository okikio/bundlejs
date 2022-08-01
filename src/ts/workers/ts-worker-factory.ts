/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')

import { createStreaming, Formatter } from "@dprint/formatter";
import { compressToURL } from "@amoutonbrady/lz-string";
import serialize from "../util/serialize-javascript";
import type ts from "typescript";

import { DefaultConfig } from "../configs/bundle-options";
import { deepAssign, deepDiff } from "../util/deep-equal";
import { getRequest } from "../util/fetch-and-cache";

let formatter: Formatter;
let config: Record<string, unknown> | undefined = {
    // TypeScript & JavaScript config goes here
    "lineWidth": 80,
    "indentWidth": 2,
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

const SyntaxKind = {
    ImportDeclaration: 265 as ts.SyntaxKind.ImportDeclaration,
    ExportDeclaration: 271 as ts.SyntaxKind.ExportDeclaration,
};

const worker = (TypeScriptWorker, fileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {
        async format(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);
            if (!formatter) formatter = await getFormatter();
            return await Promise.resolve(formatter.formatText(fileName, source.getFullText()));
        }

        async getShareableURL(fileName, config = {}) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);

            // Basically only keep the config options that have changed from the default
            let changedConfig = deepDiff(DefaultConfig, deepAssign({}, DefaultConfig, config));
            let changedEntries = Object.keys(changedConfig);

            // Collect the first few import and export statements
            let ImportExportStatements = [];
            let BackToBackImportExport = true; // Back to Back Import
            source.forEachChild(
                (node: ts.ImportDeclaration | ts.ExportDeclaration) => {
                    let isImport =
                        node.kind == SyntaxKind.ImportDeclaration;
                    let isExport =
                        node.kind == SyntaxKind.ExportDeclaration;
                    if (!BackToBackImportExport) return;

                    BackToBackImportExport = isImport || isExport || Boolean(node.moduleSpecifier);
                    if (BackToBackImportExport) {
                        let clause = isImport ? 
                            (node as ts.ImportDeclaration)?.importClause : 
                            (node as ts.ExportDeclaration)?.exportClause;
                            
                        ImportExportStatements.push({
                            kind: isImport ? "import" : "export",
                            clause: clause?.getText() ?? "*",
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
                // console.log(remainingCode, compressedURL)
                if (compressedURL.length > remainingCode.length)
                    url.searchParams.set("text", JSON.stringify(remainingCode));
                else
                    url.searchParams.set("share", compressToURL(remainingCode));
            }

            if (changedConfig && changedEntries?.length) {
                console.log(serialize(changedConfig))
                url.searchParams.set("config", serialize(changedConfig, { unsafe: true, ignoreFunction: true }));
            }
            
            // Remove decodeURIComponent(), to allow for sharing on social media platforms
            return url.toString();
        }
    };
};

// @ts-ignore
self.customTSWorkerFactory = worker;
