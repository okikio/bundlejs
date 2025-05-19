/// <reference lib="webworker" />
// Based on https://github.com/microsoft/monaco-typescript/pull/65

// This example uses @typescript/vfs to create a virtual TS program
// which can do work on a bg thread.

// This version of the vfs edits the global scope (in the case of a webworker, this is 'self')

import type { Formatter, GlobalConfiguration } from "@dprint/formatter";
import ts from "typescript"; // Import for runtime use

import { createFromBuffer, createStreaming } from "@dprint/formatter";
import { compressToURL } from "@amoutonbrady/lz-string";
import serialize from "../util/serialize-javascript";

import { DefaultConfig } from "../configs/bundle-options";
import { deepAssign, deepDiff } from "../util/deep-equal";
import { getRequest } from "../util/fetch-and-cache";
import { getModuleName, parseTreeshakeExports } from "../util/parse-query";

let formatter: Formatter;
let config: GlobalConfiguration = {
    // TypeScript & JavaScript config goes here
    "lineWidth": 80,
    "indentWidth": 2,
    "useTabs": false,
    // @ts-ignore too lazy to deal with right now
    "typescript": {
        "semiColons": "prefer", 
        "quoteStyle": "alwaysDouble"
    },
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
    let formatter: Awaited<ReturnType<typeof createFromBuffer>>;
    try {
        if (formatter) return;
        const url = new URL("/js/plugin.wasm", globalThis.location.toString()).toString();
        console.log({ dprintWasmUrl: url })

        const response = getRequest(url);
        formatter = await createStreaming(response);
        formatter.setConfig({}, config as Record<string, unknown>);
        return formatter;
    } catch (err) {
        throw err;
    }
}

getFormatter()
    .then(result => (formatter = result))
    .catch(err => console.error(err));

const SyntaxKind = {
    ImportDeclaration: 265 as ts.SyntaxKind.ImportDeclaration,
    ExportDeclaration: 271 as ts.SyntaxKind.ExportDeclaration,
};

function treeshakeArrToStr(arr: string[]) {
    return arr.map(x => x.replace(/\s/g, "").trim()).join(",").trim()
}

const worker = (TypeScriptWorker, fileMap) => {
    return class MonacoTSWorker extends TypeScriptWorker {
        async format(fileName) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);
            if (!formatter) formatter = await getFormatter();
            return await Promise.resolve(
                formatter?.formatText?.({
                    filePath: fileName,
                    fileText: source?.getFullText?.(),
                })
            );
        }

        async getShareableURL(fileName, config = {}) {
            const program = this._languageService.getProgram() as ts.Program;
            const source = program.getSourceFile(fileName);

            let changedConfig = deepDiff(DefaultConfig, deepAssign({}, DefaultConfig, config));
            let changedEntries = Object.keys(changedConfig);

            let ImportExportStatements = [];
            let BackToBackImportExport = true;
            source.forEachChild(
                (node: ts.Node) => {
                    if (!BackToBackImportExport) return;

                    let isImport = node.kind === ts.SyntaxKind.ImportDeclaration;
                    let isExport = node.kind === ts.SyntaxKind.ExportDeclaration && !!(node as ts.ExportDeclaration).moduleSpecifier;

                    BackToBackImportExport = isImport || isExport; 
                    if (BackToBackImportExport) {
                        const moduleSpecifierNode = isImport ? (node as ts.ImportDeclaration).moduleSpecifier : (node as ts.ExportDeclaration).moduleSpecifier;
                        const modulePath = moduleSpecifierNode ? moduleSpecifierNode.getText(source).replace(/^["']|["']$/g, "") : "";
                        if (!modulePath) { 
                            BackToBackImportExport = false;
                            return;
                        }
                        
                        let currentClauseText = "*"; 

                        if (isImport) {
                            const importDecl = node as ts.ImportDeclaration;
                            if (importDecl.importClause) {
                                const { importClause } = importDecl;
                                if (importClause.name) { 
                                    currentClauseText = importClause.name.text;
                                } else if (importClause.namedBindings) {
                                    if (ts.isNamespaceImport(importClause.namedBindings)) { 
                                        currentClauseText = `* as ${importClause.namedBindings.name.text}`;
                                    } else if (ts.isNamedImports(importClause.namedBindings)) { 
                                        currentClauseText = importClause.namedBindings.getText(source); 
                                    }
                                }
                                if (importClause.getText(source).trim() === "{}") { 
                                    currentClauseText = "{}"; 
                                }
                            } else {
                                currentClauseText = "side-effect"; 
                            }
                        } else { // isExport
                            const exportDecl = node as ts.ExportDeclaration;
                            if (exportDecl.exportClause) { 
                                if (ts.isNamedExports(exportDecl.exportClause)) {
                                     currentClauseText = exportDecl.exportClause.getText(source); 
                                } else if (ts.isNamespaceExport?.(exportDecl.exportClause)) { 
                                    currentClauseText = `* as ${(exportDecl.exportClause as ts.NamespaceExport).name.text}`;
                                } else {
                                    const clauseText = exportDecl.exportClause.getText(source); 
                                    currentClauseText = clauseText.length > 0 ? clauseText : "*";
                                }
                            } else {
                                currentClauseText = "*";
                            }
                        }
                        
                        ImportExportStatements.push({
                            kind: isImport ? "import" : "export",
                            clause: currentClauseText,
                            module: modulePath, 
                            pos: {
                                start: node.getStart(source), 
                                end: node.getEnd(),
                            },
                        });
                    }
                }
            );

            let remainingCode = source.getFullText();
            [...ImportExportStatements].sort((a,b) => b.pos.start - a.pos.start).forEach(({ pos }) => { // Sort to remove from end to start
                remainingCode = remainingCode.substring(0, pos.start) + remainingCode.substring(pos.end);
            });
            
            const defaultComment = "// Click Build for the Bundled, Minified & Compressed package size";
            remainingCode = remainingCode.trim();
            if (remainingCode.startsWith(defaultComment)) {
                remainingCode = remainingCode.substring(defaultComment.length).trim();
            }

            let finalModulesStr = "";
            let finalTreeshakeStr = "";

            if (ImportExportStatements.length > 0) {
                const modulePathToStatements = new Map<string, { kind: string; clause: string; module: string }[]>();
                ImportExportStatements.forEach(stmt => {
                    if (!modulePathToStatements.has(stmt.module)) {
                        modulePathToStatements.set(stmt.module, []);
                    }
                    modulePathToStatements.get(stmt.module).push(stmt);
                });

                let allModulesFollowSimplePattern = true;
                const tempModules = [];

                for (const [modulePath, statements] of modulePathToStatements.entries()) {
                    const isImportModule = statements[0].kind === "import";
                    let isThisModuleSimple = false;

                    if (isImportModule) {
                        const hasNamespace = statements.find(s => s.clause.startsWith("* as "));
                        const hasDefaultAliased = statements.find(s => /^{ default as \\w+ }$/.test(s.clause.replace(/\\s+/g, ' ')));
                        if (statements.length === 2 && hasNamespace && hasDefaultAliased) {
                            isThisModuleSimple = true;
                        }
                    } else { // Export module
                        const hasNamespaceAliased = statements.find(s => s.clause.startsWith("* as "));
                        const hasDefaultNonAliased = statements.find(s => s.clause.replace(/\\s+/g, ' ') === "{ default }");
                        if (statements.length === 2 && hasNamespaceAliased && hasDefaultNonAliased) {
                            isThisModuleSimple = true;
                        }
                        
                        if (!isThisModuleSimple) { // Check legacy simple export pattern
                            const hasStar = statements.find(s => s.clause === "*");
                            const hasDefaultPossiblyAliased = statements.find(s => s.clause.replace(/\\s+/g, ' ') === "{ default }" || /^{ default as \\w+ }$/.test(s.clause.replace(/\\s+/g, ' ')));
                            if (statements.length === 2 && hasStar && hasDefaultPossiblyAliased) {
                                isThisModuleSimple = true;
                            }
                        }
                    }

                    if (isThisModuleSimple) {
                        tempModules.push((isImportModule ? "(import)" : "") + modulePath);
                    } else {
                        allModulesFollowSimplePattern = false;
                        break; 
                    }
                }

                if (allModulesFollowSimplePattern) {
                    finalModulesStr = tempModules.join(",");
                    // finalTreeshakeStr remains empty
                } else {
                    // Not all simple, so construct full q and treeshake
                    ImportExportStatements.forEach(v => {
                        finalModulesStr += (v.kind === "import" ? "(import)" : "") + v.module + ",";
                        finalTreeshakeStr += "[" + v.clause.split(",").map(s => s.trim()).join(",") + "],";
                    });
                    finalModulesStr = finalModulesStr.replace(/,$/, "").trim();
                    finalTreeshakeStr = finalTreeshakeStr.replace(/\\]\\,$/, "]").trim();
                }
            }
            
            let url = new URL(self.location.origin.toString());
            if (finalModulesStr.length > 0) { 
                url.searchParams.set("q", finalModulesStr);
            }
            if (finalTreeshakeStr.length > 0) {
                url.searchParams.set("treeshake", finalTreeshakeStr);
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
