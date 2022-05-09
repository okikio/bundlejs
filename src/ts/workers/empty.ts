/// <reference lib="webworker" />
export {};



// const TypeAquisition = setupTypeAcquisition({
//     projectName: "My ATA Project",
//     typescript: ts,
//     logger: console,
//     async fetcher(input, init) {
//         return await getRequest(input, false, init);
//     },
//     delegate: {
//         started: () => {
//             console.log("Types Aquisition Start")
//         },
//         receivedFile: (code: string, path: string) => {
//             // Add code to your runtime at the path...
//             languages.typescript.typescriptDefaults.addExtraLib(code, "file://" + path);

//             const uri = Uri.file(path);
//             if (Editor.getModel(uri) === null) {
//                 Editor.createModel(code, "typescript", uri);
//             }
//         },
//         progress: (downloaded: number, total: number) => {
//             console.log(`Got ${downloaded} out of ${total}`)
//         },
//         finished: vfs => {
//             console.log("Types Aquisition Done");
//         },
//     },
// });

// const getTypescriptTypes = async (model: typeof inputModel) => {
//     try {
//         const worker = await languages.typescript.getTypeScriptWorker();
//         await worker(model.uri);

//         // @ts-ignore
//         TypeAquisition(model.getValue());
//     } catch (e) {
//         console.warn(e);
//     }
// };

// setTimeout(() => {
//     getTypescriptTypes(inputModel);
// }, 1000);
