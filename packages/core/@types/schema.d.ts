declare const schema: {
    type: string;
    properties: {
        rollup: {
            description: string;
            anyOf: ({
                $ref: string;
                type?: undefined;
            } | {
                type: string;
                $ref?: undefined;
            })[];
        };
        esbuild: {
            $ref: string;
            description: string;
        };
        cdn: {
            description: string;
            anyOf: ({
                allOf: ({
                    type: string;
                    properties: {};
                } | {
                    type: string;
                    properties?: undefined;
                })[];
                enum?: undefined;
                type?: undefined;
            } | {
                enum: string[];
                type: string;
                allOf?: undefined;
            })[];
        };
        alias: {
            $ref: string;
            description: string;
        };
        compression: {
            description: string;
            anyOf: ({
                description: string;
                type: string;
                properties: {
                    type: {
                        $ref: string;
                        description: string;
                    };
                    quality: {
                        description: string;
                        enum: number[];
                        type: string;
                    };
                };
                enum?: undefined;
            } | {
                enum: string[];
                type: string;
                description?: undefined;
                properties?: undefined;
            })[];
        };
        analysis: {
            description: string;
            enum: (string | boolean)[];
        };
        ascii: {
            description: string;
            enum: string[];
            type: string;
        };
        filesystem: {
            description: string;
            type: string;
            properties: {
                files: {
                    $ref: string;
                    description: string;
                };
                get: {
                    description: string;
                    type: string;
                };
                set: {
                    description: string;
                    type: string;
                };
                resolve: {
                    description: string;
                    type: string;
                };
                clear: {
                    description: string;
                    type: string;
                };
            };
        };
        init: {
            description: string;
            allOf: ({
                $ref: string;
                type?: undefined;
                properties?: undefined;
            } | {
                type: string;
                properties: {
                    platform: {
                        $ref: string;
                    };
                };
                $ref?: undefined;
            })[];
        };
        entryPoints: {
            description: string;
            anyOf: ({
                type: string;
                items: {
                    type: string;
                };
                $ref?: undefined;
            } | {
                $ref: string;
                type?: undefined;
                items?: undefined;
            })[];
        };
    };
    definitions: {
        OutputOptions: {
            type: string;
            properties: {
                amd: {
                    anyOf: ({
                        allOf: ({
                            type: string;
                            properties: {
                                autoId: {
                                    type: string;
                                    enum: boolean[];
                                };
                                id: {
                                    type: string;
                                };
                                define?: undefined;
                            };
                        } | {
                            type: string;
                            properties: {
                                define: {
                                    type: string;
                                };
                                autoId?: undefined;
                                id?: undefined;
                            };
                        })[];
                    } | {
                        allOf: ({
                            type: string;
                            properties: {
                                autoId: {
                                    type: string;
                                    enum: boolean[];
                                };
                                basePath: {
                                    type: string;
                                };
                                id: {
                                    type: string;
                                };
                                define?: undefined;
                            };
                        } | {
                            type: string;
                            properties: {
                                define: {
                                    type: string;
                                };
                                autoId?: undefined;
                                basePath?: undefined;
                                id?: undefined;
                            };
                        })[];
                    })[];
                };
                assetFileNames: {
                    type: string[];
                };
                banner: {
                    type: string[];
                };
                chunkFileNames: {
                    type: string[];
                };
                compact: {
                    type: string;
                };
                dir: {
                    type: string;
                };
                dynamicImportFunction: {
                    type: string;
                };
                entryFileNames: {
                    type: string[];
                };
                esModule: {
                    type: string;
                };
                exports: {
                    enum: string[];
                    type: string;
                };
                extend: {
                    type: string;
                };
                externalLiveBindings: {
                    type: string;
                };
                file: {
                    type: string;
                };
                footer: {
                    type: string[];
                };
                format: {
                    $ref: string;
                };
                freeze: {
                    type: string;
                };
                generatedCode: {
                    anyOf: ({
                        $ref: string;
                        enum?: undefined;
                        type?: undefined;
                    } | {
                        enum: string[];
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                globals: {
                    anyOf: ({
                        type: string;
                        additionalProperties: {
                            type: string;
                        };
                    } | {
                        type: string;
                        additionalProperties?: undefined;
                    })[];
                };
                hoistTransitiveImports: {
                    type: string;
                };
                indent: {
                    type: string[];
                };
                inlineDynamicImports: {
                    type: string;
                };
                interop: {
                    anyOf: ({
                        enum: (string | boolean)[];
                        type?: undefined;
                    } | {
                        type: string;
                        enum?: undefined;
                    })[];
                };
                intro: {
                    type: string[];
                };
                manualChunks: {
                    anyOf: ({
                        type: string;
                        additionalProperties: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                    } | {
                        type: string;
                        additionalProperties?: undefined;
                    })[];
                };
                minifyInternalExports: {
                    type: string;
                };
                name: {
                    type: string;
                };
                namespaceToStringTag: {
                    type: string;
                };
                noConflict: {
                    type: string;
                };
                outro: {
                    type: string[];
                };
                paths: {
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                plugins: {
                    type: string;
                    items: {
                        anyOf: ({
                            $ref: string;
                            enum?: undefined;
                            type?: undefined;
                        } | {
                            enum: boolean[];
                            type: string;
                            $ref?: undefined;
                        })[];
                    };
                };
                preferConst: {
                    type: string;
                };
                preserveModules: {
                    type: string;
                };
                preserveModulesRoot: {
                    type: string;
                };
                sanitizeFileName: {
                    type: string[];
                };
                sourcemap: {
                    enum: (string | boolean)[];
                };
                sourcemapExcludeSources: {
                    type: string;
                };
                sourcemapFile: {
                    type: string;
                };
                sourcemapPathTransform: {
                    type: string;
                };
                strict: {
                    type: string;
                };
                systemNullSetters: {
                    type: string;
                };
                validate: {
                    type: string;
                };
            };
        };
        ModuleFormat: {
            enum: string[];
            type: string;
        };
        GeneratedCodeOptions: {
            type: string;
            properties: {
                preset: {
                    $ref: string;
                };
                arrowFunctions: {
                    type: string;
                };
                constBindings: {
                    type: string;
                };
                objectShorthand: {
                    type: string;
                };
                reservedNamesAsProps: {
                    type: string;
                };
                symbols: {
                    type: string;
                };
            };
        };
        GeneratedCodePreset: {
            enum: string[];
            type: string;
        };
        "Record<string,string>": {
            type: string;
        };
        OutputPlugin: {
            type: string;
            properties: {
                name: {
                    type: string;
                };
                augmentChunkHash: {
                    type: string;
                };
                generateBundle: {
                    type: string;
                };
                outputOptions: {
                    type: string;
                };
                renderChunk: {
                    type: string;
                };
                renderDynamicImport: {
                    type: string;
                };
                renderError: {
                    type: string;
                };
                renderStart: {
                    type: string;
                };
                resolveAssetUrl: {
                    type: string;
                };
                resolveFileUrl: {
                    type: string;
                };
                resolveImportMeta: {
                    type: string;
                };
                writeBundle: {
                    type: string;
                };
                banner: {
                    type: string[];
                };
                cacheKey: {
                    type: string;
                };
                footer: {
                    type: string[];
                };
                intro: {
                    type: string[];
                };
                outro: {
                    type: string[];
                };
            };
        };
        BuildOptions: {
            type: string;
            properties: {
                bundle: {
                    description: string;
                    type: string;
                };
                splitting: {
                    description: string;
                    type: string;
                };
                preserveSymlinks: {
                    description: string;
                    type: string;
                };
                outfile: {
                    description: string;
                    type: string;
                };
                metafile: {
                    description: string;
                    type: string;
                };
                outdir: {
                    description: string;
                    type: string;
                };
                outbase: {
                    description: string;
                    type: string;
                };
                platform: {
                    $ref: string;
                    description: string;
                };
                external: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                loader: {
                    description: string;
                    type: string;
                    additionalProperties: {
                        enum: string[];
                        type: string;
                    };
                };
                resolveExtensions: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                mainFields: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                conditions: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                write: {
                    description: string;
                    type: string;
                };
                allowOverwrite: {
                    description: string;
                    type: string;
                };
                tsconfig: {
                    description: string;
                    type: string;
                };
                outExtension: {
                    description: string;
                    type: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                publicPath: {
                    description: string;
                    type: string;
                };
                entryNames: {
                    description: string;
                    type: string;
                };
                chunkNames: {
                    description: string;
                    type: string;
                };
                assetNames: {
                    description: string;
                    type: string;
                };
                inject: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                banner: {
                    description: string;
                    type: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                footer: {
                    description: string;
                    type: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                incremental: {
                    description: string;
                    type: string;
                };
                entryPoints: {
                    description: string;
                    anyOf: ({
                        type: string;
                        items: {
                            type: string;
                        };
                        $ref?: undefined;
                    } | {
                        $ref: string;
                        type?: undefined;
                        items?: undefined;
                    })[];
                };
                stdin: {
                    $ref: string;
                    description: string;
                };
                plugins: {
                    description: string;
                    type: string;
                    items: {
                        $ref: string;
                    };
                };
                absWorkingDir: {
                    description: string;
                    type: string;
                };
                nodePaths: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                watch: {
                    description: string;
                    anyOf: ({
                        $ref: string;
                        type?: undefined;
                    } | {
                        type: string;
                        $ref?: undefined;
                    })[];
                };
                sourcemap: {
                    description: string;
                    enum: (string | boolean)[];
                };
                legalComments: {
                    description: string;
                    enum: string[];
                    type: string;
                };
                sourceRoot: {
                    description: string;
                    type: string;
                };
                sourcesContent: {
                    description: string;
                    type: string;
                };
                format: {
                    $ref: string;
                    description: string;
                };
                globalName: {
                    description: string;
                    type: string;
                };
                target: {
                    description: string;
                    anyOf: ({
                        type: string;
                        items: {
                            type: string;
                        };
                    } | {
                        type: string;
                        items?: undefined;
                    })[];
                };
                supported: {
                    $ref: string;
                    description: string;
                };
                mangleProps: {
                    $ref: string;
                    description: string;
                };
                reserveProps: {
                    $ref: string;
                    description: string;
                };
                mangleQuoted: {
                    description: string;
                    type: string;
                };
                mangleCache: {
                    $ref: string;
                    description: string;
                };
                drop: {
                    description: string;
                    type: string;
                    items: {
                        enum: string[];
                        type: string;
                    };
                };
                minify: {
                    description: string;
                    type: string;
                };
                minifyWhitespace: {
                    description: string;
                    type: string;
                };
                minifyIdentifiers: {
                    description: string;
                    type: string;
                };
                minifySyntax: {
                    description: string;
                    type: string;
                };
                charset: {
                    $ref: string;
                    description: string;
                };
                treeShaking: {
                    description: string;
                    type: string;
                };
                ignoreAnnotations: {
                    description: string;
                    type: string;
                };
                jsx: {
                    description: string;
                    enum: string[];
                    type: string;
                };
                jsxFactory: {
                    description: string;
                    type: string;
                };
                jsxFragment: {
                    description: string;
                    type: string;
                };
                define: {
                    description: string;
                    type: string;
                    additionalProperties: {
                        type: string;
                    };
                };
                pure: {
                    description: string;
                    type: string;
                    items: {
                        type: string;
                    };
                };
                keepNames: {
                    description: string;
                    type: string;
                };
                color: {
                    description: string;
                    type: string;
                };
                logLevel: {
                    $ref: string;
                    description: string;
                };
                logLimit: {
                    description: string;
                    type: string;
                };
                logOverride: {
                    $ref: string;
                    description: string;
                };
            };
        };
        Platform: {
            enum: string[];
            type: string;
        };
        StdinOptions: {
            type: string;
            properties: {
                contents: {
                    type: string;
                };
                resolveDir: {
                    type: string;
                };
                sourcefile: {
                    type: string;
                };
                loader: {
                    $ref: string;
                };
            };
        };
        Loader: {
            enum: string[];
            type: string;
        };
        Plugin: {
            type: string;
            properties: {
                name: {
                    type: string;
                };
                setup: {
                    type: string;
                };
            };
        };
        WatchMode: {
            type: string;
            properties: {
                onRebuild: {
                    type: string;
                };
            };
        };
        Format: {
            enum: string[];
            type: string;
        };
        "Record<string,boolean>": {
            type: string;
        };
        RegExp: {
            type: string;
            properties: {
                source: {
                    type: string;
                };
                global: {
                    type: string;
                };
                ignoreCase: {
                    type: string;
                };
                multiline: {
                    type: string;
                };
                lastIndex: {
                    type: string;
                };
                flags: {
                    type: string;
                };
                sticky: {
                    type: string;
                };
                unicode: {
                    type: string;
                };
                dotAll: {
                    type: string;
                };
            };
        };
        "Record<string,string|false>": {
            type: string;
        };
        Charset: {
            enum: string[];
            type: string;
        };
        LogLevel: {
            enum: string[];
            type: string;
        };
        "Record<string,LogLevel>": {
            type: string;
        };
        CompressionType: {
            description: string;
            enum: string[];
            type: string;
        };
        "Map<string,Uint8Array>": {
            type: string;
            properties: {
                size: {
                    type: string;
                };
                "__@toStringTag@23": {
                    type: string;
                };
            };
        };
        InitializeOptions: {
            type: string;
            properties: {
                wasmURL: {
                    description: string;
                    type: string;
                };
                wasmModule: {
                    $ref: string;
                    description: string;
                };
                worker: {
                    description: string;
                    type: string;
                };
            };
        };
        "WebAssembly.Module": {
            type: string;
        };
        PLATFORM: {
            description: string;
            enum: string[];
            type: string;
        };
    };
    $schema: string;
};
export default schema;
