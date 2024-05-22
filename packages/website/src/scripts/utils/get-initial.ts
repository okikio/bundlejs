import { deepMerge } from "@bundle/utils/utils/deep-equal.ts";
import { EasyDefaultConfig } from "../configs/options";
import { parseShareURLQuery } from "@bundle/query-string/src/parse-query.ts";
export function generateConfigValue(config: string | Record<string, unknown>) {
  return [
    "// Configure",
    "import type { ConfigOptions } from \"@bundle/core\";",
    `export default ${typeof config == "string" ? config : JSON.stringify(config, null, "\t")} as ConfigOptions;`
  ].join("\n");
}

export const outputModelResetValue = "// Output";
export const inputModelResetValue = [
  "// Click build for the bundled, minified and compressed package size",
  "export * from \"@okikio/animate\";"
].join("\n");
export const configModelResetValue = generateConfigValue(EasyDefaultConfig);

export function getShareURLValues() {
  const shareURL = new URL(globalThis.location.href);

  // If the URL contains share details make sure to use those details
  // e.g. config, query, etc...
  if (shareURL.search) {
    const searchParams = shareURL.searchParams;

    const configQuery = searchParams.get("config");
    return {
      plaintext: searchParams.get("text"),
      query: searchParams.get("query") || searchParams.get("q"),
      share: searchParams.get("share"),
      bundle: searchParams.get("bundle"),
      config: configQuery,

      inputValue: parseShareURLQuery(shareURL),
      configValue: configQuery ? generateConfigValue(
        deepMerge(structuredClone(EasyDefaultConfig), JSON.parse(configQuery))
      ) : configModelResetValue
    };
  }

  return {
    inputValue: parseShareURLQuery(shareURL),
    configValue: configModelResetValue
  };
}