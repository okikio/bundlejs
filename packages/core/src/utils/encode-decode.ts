// export const { encode } = new TextEncoder();
// export const { decode } = new TextDecoder();

export const encode = (str: string) => new TextEncoder().encode(str);
export const decode = (buf: BufferSource) => new TextDecoder().decode(buf);