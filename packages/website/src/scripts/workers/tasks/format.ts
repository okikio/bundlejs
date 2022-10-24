/// <reference lib="webworker" />
import type { Formatter } from "@dprint/formatter";
import { createStreaming } from "@dprint/formatter";
import { getRequest } from "@bundlejs/core/src/index";

let formatter: Formatter;
const config: Record<string, unknown> | undefined = {
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
  const url = new URL("/dprint-typescript-plugin.wasm", globalThis.location.toString()).toString();
  const response = getRequest(url);
  const formatter = await createStreaming(response);
  formatter.setConfig({}, config);
  return formatter;
};

// getFormatter().then(result => (formatter = result));

export async function format(fileName: string, content: string) {
  if (!formatter) formatter = await getFormatter();
  return await Promise.resolve(formatter.formatText(fileName, content));
}

export default format;