import type { TransferHandler } from "comlink";
import * as Comlink from "comlink";

import type { TypeTransferable } from "transferables";
import { getTransferables, hasTransferables } from "transferables";

/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const transferableTransferHandler: TransferHandler<object, object> = {
  canHandle(obj): obj is object {
    return hasTransferables(obj, true);
  },
  serialize(obj) {
    return [
      obj,
      getTransferables(obj, true) as unknown as Transferable[],
    ];
  },
  deserialize(obj) {
    return obj;
  },
};

Comlink.transferHandlers.set("transferable", transferableTransferHandler);