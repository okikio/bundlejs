import { minify } from "terser";
import { codeFrameColumns } from "@babel/code-frame";

import type { MinifyOptions } from "terser";
import type { Plugin } from "rollup";

export const terser = (options: MinifyOptions = { module: true }) => {
    return {
        name: "terser",
        async transform(code) {
            try {
                return await minify(code,);
            } catch (error) {
                const { message, line, col: column } = error;
                console.error(
                    codeFrameColumns(code, { start: { line, column } }, { message })
                );

                throw error;
            }
        },
    } as Plugin;
};