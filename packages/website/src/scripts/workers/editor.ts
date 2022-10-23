/// <reference lib="webworker" />
// export * from "monaco-editor/esm/vs/editor/editor.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// import { initialize } from "./worker-init";

// The Editor worker is really not nesscary, so, I set it up to be self terminating 
const connect = () => {
  console.log("Empty Editor Worker");
  self.close();
};

(self as unknown as SharedWorkerGlobalScope).onconnect = () => {
  connect();
};

if (!("SharedWorkerGlobalScope" in self)) {
  connect();
}

export { };