/// <reference lib="webworker" />
import ts from "typescript";
import { deepAssign, deepDiff, lzstring } from "@bundlejs/core/src/index";
import { createFile } from "./create-file";

const { compressToURL } = lzstring;

export async function getShareURL(fileName: string, content: string, config = "{}") {
  const source = await createFile(fileName, content);
  config = JSON.parse(config ? config : "{}") ?? {};

  // Basically only keep the config options that have changed from the default
  // DefaultConfig
  let changedConfig = deepDiff({}, deepAssign({}, {}, config));
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

export default getShareURL;