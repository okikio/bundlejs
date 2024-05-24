import type { TransferHandler } from "comlink";
import * as Comlink from "comlink";

import { 
  getTransferables, 
  hasTransferables, 
  isSupported,
} from "@okikio/transferables";

const support = await isSupported();

/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const transferableTransferHandler: TransferHandler<object, object> = {
  canHandle(obj): obj is object {
    return hasTransferables(obj, support.streams);
  },
  serialize(obj) {
    const transferables: Transferable[] = getTransferables(obj, support.streams);
    console.log({
      obj, transferables
    })
    return [
      obj,
      transferables,
    ];
  },
  deserialize(obj) {
    return obj;
  },
};

Comlink.transferHandlers.set("transferable", transferableTransferHandler);