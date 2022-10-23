import { deepAssign } from "@bundlejs/core/src/util";
import { EasyDefaultConfig } from "../configs/options";
import { parseShareURLQuery } from "./parse-query";
export function generateConfigValue(config: string | Record<string, unknown>) {
  return [
    "// Configure",
    "import type { ConfigOptions } from \"@bundlejs/core\";",
    `export default ${typeof config == "string" ? config : JSON.stringify(config, null, "\t")} as ConfigOptions;`
  ].join("\n");
}
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
        deepAssign({}, EasyDefaultConfig, JSON.parse(configQuery))
      ) : configModelResetValue
    };
  }

  return {
    inputValue: parseShareURLQuery(shareURL),
    configValue: configModelResetValue
  };
}