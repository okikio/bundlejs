declare module 'worker:*' {
    let value: string;
    export default value;
}

declare module '*.wasm' {
    let value: Promise<Record<string, any>>;
    export default value;
}