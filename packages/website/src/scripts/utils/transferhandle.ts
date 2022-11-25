import type { TransferHandler } from "comlink";
import * as Comlink from "comlink";

export const TypedArray = Object.getPrototypeOf(Int8Array);
export const AudioData = globalThis.AudioData;
export const VideoFrame = globalThis.VideoFrame;
export const OffscreenCanvas = globalThis.OffscreenCanvas;
export const RTCDataChannel = globalThis.RTCDataChannel;

export type TypeTypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export type TypeTransferable = ArrayBuffer | MessagePort | ReadableStream | WritableStream | TransformStream /* | typeof AudioData */ | ImageBitmap /* | typeof VideoFrame */ | OffscreenCanvas | RTCDataChannel;

/**
 * Check if an object is an object or a function (because functions also count as objects)
 */
export function isObject(obj: unknown): obj is object | Function {
  return (typeof obj === "object" && obj !== null) || typeof obj === "function";
}

/**
 * Check if an object is an instanceof [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) or [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
 * 
 * > `DataView` a lower level `TypedArray` which can function while ignoring the platforms inherent endianness. Read more on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
 */
export function isTypedArray(obj: unknown): obj is TypeTypedArray | DataView {
  return obj instanceof TypedArray || obj instanceof DataView;
}

/**
 * Check's if an object is `ReadableStream`, `WritableStream` and/or `TransformStream`
 * 
 * > Note: None of the stream API's are transferables in Safari 😥
 */
export function isStream(obj: unknown): obj is ReadableStream | WritableStream | TransformStream {
  return (
    ("ReadableStream" in globalThis && obj instanceof ReadableStream) ||
    ("WritableStream" in globalThis && obj instanceof WritableStream) ||
    ("TransformStream" in globalThis && obj instanceof TransformStream)
  );
}

/**
 * Check's if an object is `MessageChannel`
 */
export function isMessageChannel(obj: unknown): obj is MessageChannel {
  return (
    ("MessageChannel" in globalThis && obj instanceof MessageChannel)
  );
}

/**
 * Check if an object is a supported transferable
 */
export function isTransferable(obj: unknown): obj is TypeTransferable {
  return (
    ("ArrayBuffer" in globalThis && obj instanceof ArrayBuffer) ||
    ("MessagePort" in globalThis && obj instanceof MessagePort) ||
    ("AudioData" in globalThis && obj instanceof AudioData) ||
    ("ImageBitmap" in globalThis && obj instanceof ImageBitmap) ||
    ("VideoFrame" in globalThis && obj instanceof VideoFrame) ||
    ("OffscreenCanvas" in globalThis && obj instanceof OffscreenCanvas) ||
    ("RTCDataChannel" in globalThis && obj instanceof RTCDataChannel)
  );
}

/**
 * Filters out duplicate items
 */
export function filterOutDuplicates<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Create an array of transferable objects which exist in a given object, to a maximum set depth given
 * Thanks @aaorris
 * 
 * @param obj Input object
 * @param streams Includes streams as transferable
 * @param maxCount Maximum iteration
 * @returns An array of transferable objects
 */
export function getTransferables(obj: unknown, streams = false, maxCount = 10_000): TypeTransferable[] {
  const result = new Set([]);

  let nextQueue = [];
  let queue = [obj];

  while (queue.length > 0 && maxCount > 0) {
    for (let item of queue) {
      if (isTypedArray(item)) {
        result.add((item as TypeTypedArray).buffer);
      } else if (isTransferable(item)) {
        result.add(item);
      } else if (isMessageChannel(item)) {
        result.add(item.port1);
        result.add(item.port2);
      } else if (streams && isStream(item)) {
        result.add(item);
      }

      /**  
       * Streams are circular objects, to avoid an infinite loop 
       * we need to ensure that the object is not a stream 
      */
      else if (isObject(item) && !isStream(item)) {
        const values = Array.isArray(item) ? item : Object.values(item);
        const len = values.length;

        for (let j = 0; j < len; j++) {
          nextQueue.push(values[j]);
        }
      }
    }

    queue = nextQueue;
    nextQueue = [];

    maxCount--;
  }

  return Array.from(result);
}

/**
 * Create an array of transferable objects which exist in a given object, to a maximum set depth given
 * Thanks @aaorris
 * 
 * @param obj Input object
 * @param streams Includes streams as transferable
 * @param maxCount Maximum iteration
 * @returns An array of transferable objects
 */
export function* getTransferable(obj: unknown, streams = false, maxCount = 10_000): Generator<TypeTransferable | TypeTypedArray | MessageChannel | DataView> {
  const seen = new Set([]);

  let queue = [obj];
  let nextQueue = [];

  while (queue.length > 0 && maxCount > 0) {
    for (let item of queue) {
      const newItem = !seen.has(item);
      if (isTypedArray(item)) {
        if (newItem) {
          const { buffer } = item;
          if (!seen.has(buffer)) {
            yield buffer;
            seen.add(buffer);
          }

          seen.add(item);
        }
      } else if (isMessageChannel(item)) {
        if (newItem) {
          yield item.port1;
          seen.add(item.port1);

          yield item.port2;
          seen.add(item.port2);
        }
      } else if (isTransferable(item) || (streams && isStream(item))) {
        if (newItem) {
          yield item;
          seen.add(item);
        }
      }

      /**  
       * Streams are circular objects, to avoid an infinite loop 
       * we need to ensure that the object is not a stream 
      */
      else if (!isStream(item) && isObject(item)) {
        const values = (Array.isArray(item) ? item : Object.values(item));
        const len = values.length;

        for (let j = 0; j < len; j++) {
          nextQueue.push(values[j])
        }
      }
    }

    queue = nextQueue;
    nextQueue = [];

    maxCount--;
  }

  seen.clear();
  queue = null;
  nextQueue = null;

  return null;
}

/**
 * Check if object contains transferable objects
 * Thanks @aaorris
 * 
 * @param obj Input object
 * @param depth Maximum depth to look
 * @param streams Includes streams as transferable
 * @returns Whether object contains transferable objects
 */
// export function hasTransferables(obj: unknown, depth = 25, streams = false): boolean {
//   if (depth <= 0) return false;

//   if (streams && isStream(obj)) {
//     return true;
//   } else if (isTypedArray(obj) || isTransferable(obj)) {
//     return true;
//   }

//   /* 
//     Streams are circular objects, to avoid an infinite loop 
//     we need to ensure that the object is not a stream 
//   */
//   else if (isObject(obj) && !isStream(obj)) {
//     const deepValues = [];
//     const values = Array.isArray(obj) ? obj : Object.values(obj);
//     const inBreadth = values.some(x => {
//       if ((streams && isStream(x)) || isTypedArray(x) || isTransferable(x)) return true;
//       if (isObject(x)) {
//         const asValues = Array.isArray(obj) ? obj : Object.values(obj); 
//         const len = asValues.length;
//         // deepValues.push(...asValues);
//         for (let j = 0; j < len; j++) {
//           deepValues.push(asValues[j])
//         }
//       }
//       return false;
//     });

//     if (inBreadth) return true;
//     return deepValues.some(x => hasTransferables(x, depth - 1, streams));
//   }

//   return false;
// }


/**
 * Check if object contains transferable objects
 * Thanks @aaorris
 * 
 * @param obj Input object
 * @param streams Includes streams as transferable
 * @param maxCount Maximum iteration
 * @returns Whether object contains transferable objects
 */
export function hasTransferables(obj: unknown, streams = false, maxCount = 10_000): boolean {
  let queue = [obj];
  let nextQueue = [];

  while (queue.length > 0 && maxCount > 0) {
    for (let item of queue) {
      if (isTypedArray(item)) {
        return true;
      } else if (isTransferable(item)) {
        return true;
      } else if (isMessageChannel(item)) {
        return true;
      } else if (streams && isStream(item)) {
        return true;
      }

      /**  
       * Streams are circular objects, to avoid an infinite loop 
       * we need to ensure that the object is not a stream 
      */
      if (isObject(item) && !isStream(item)) {
        const values = Array.isArray(item) ? item : Object.values(item);
        const len = values.length;

        for (let j = 0; j < len; j++) {
          nextQueue.push(values[j])
        }
      }
    }

    queue = nextQueue;
    nextQueue = [];

    maxCount--;
  }

  queue = null;
  nextQueue = null;

  return false;
}

/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const transferableTransferHandler: TransferHandler<object, TypeTransferable | TypeTypedArray | MessageChannel | DataView> = {
  canHandle(obj): obj is object {
    return hasTransferables(obj, true);
  },
  serialize(obj) {
    return [
      obj,
      getTransferables(obj, true),
    ];
  },
  deserialize(obj) {
    return obj;
  },
};

Comlink.transferHandlers.set("transferable", transferableTransferHandler);