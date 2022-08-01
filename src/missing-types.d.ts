declare module 'worker:*' {
    let value: string;
    export default value;
}

declare module '*.wasm' {
    let value: Promise<Record<string, any>>;
    export default value;
}

declare module 'dts:*' {
    let value: Record<any, any>;
    export default value;
}