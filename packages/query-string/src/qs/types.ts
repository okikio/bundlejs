export interface IStringifyOptions {
  addQueryPrefix?: boolean;
  allowDots?: boolean;
  arrayFormat?: "brackets" | "comma" | "indices" | "repeat";
  commaRoundTrip?: boolean;
  charset?: "utf-8" | "iso-8859-1";
  charsetSentinel?: boolean;
  delimiter?: string;
  encode?: boolean;
  encoder?: ((str: any, charset: string, format?: "RFC1738" | "RFC3986", type?: "key" | "value") => string);
  encodeValuesOnly?: boolean;
  format?: "RFC1738" | "RFC3986";
  filter?: Array<string | number> | ((prefix: string, value: any) => any);
  /** @deprecated */
  indices?: boolean;
  serializeDate?: ((d: Date) => string | number);
  skipNulls?: boolean;
  sort?: ((a: any, b: any) => number);
  strictNullHandling?: boolean;
}
