declare module "*.wasm?to-js" {
  export const source: Promise<Uint8Array>;
  export default source;
}