// export const { encode } = new TextEncoder();
// export const { decode } = new TextDecoder();
export const encode = (str) => new TextEncoder().encode(str);
export const decode = (buf) => new TextDecoder().decode(buf);
