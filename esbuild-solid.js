import { parse } from "path";
import { readFile } from "fs/promises";
import { transformAsync } from "@babel/core";
import solid from "babel-preset-solid";
import ts from "@babel/preset-typescript";

const JSX_RE = /<.+?>/gim;

export default () => {
    return {
        name: "esbuild:solid",

        setup(build) {
            build.onLoad({ filter: /\.(t|j)sx$/ }, async (args) => {
                const source = await readFile(args.path, { encoding: "utf-8" });
                const isJsx = JSX_RE.test(source);

                if (!isJsx) return { contents: source, loader: "js" };
                const { name, ext } = parse(args.path);
                const filename = name + ext;

                const { code } = await transformAsync(source, {
                    presets: [solid, ts],
                    filename,
                    sourceMaps: "inline",
                });

                return { contents: code, loader: "js" };
            });
        },
    };
}