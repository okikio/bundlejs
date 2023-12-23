/**
 * Defines the format types for encoding.
 */
export enum Format {
  RFC1738 = 'RFC1738',
  RFC3986 = 'RFC3986'
}

/**
 * A map of formatters for different encoding formats.
 */
export const formatters: { [key in Format]: (value: string) => string } = {
  [Format.RFC1738]: (value: string) => value.replace(/%20/g, '+'),
  [Format.RFC3986]: (value: string) => String(value)
};

export default {
  default: Format.RFC3986,
  formatters,
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
