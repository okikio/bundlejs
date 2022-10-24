import type { TransferHandler } from "comlink";
import * as Comlink from "comlink";

const TypedArray = Object.getPrototypeOf(Int8Array);
const AudioData = globalThis.AudioData;
const VideoFrame = globalThis.VideoFrame;
const OffscreenCanvas = globalThis.OffscreenCanvas;
const RTCDataChannel = globalThis.RTCDataChannel;

type TypeTypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
type Transferable = ArrayBuffer | MessagePort | ReadableStream | WritableStream | TransformStream | typeof AudioData | ImageBitmap | typeof VideoFrame | OffscreenCanvas | RTCDataChannel;

const isObject = (val: unknown): val is object =>
  (typeof val === "object" && val !== null) || typeof val === "function";

function isTypedArray(obj: unknown) {
  return obj instanceof TypedArray || obj instanceof DataView;
}

function isTransferable(obj: unknown) {
  return ("ArrayBuffer" in globalThis && obj instanceof ArrayBuffer) ||
    ("MessagePort"      in globalThis && obj instanceof MessagePort) ||
    ("ReadableStream"   in globalThis && obj instanceof ReadableStream) ||
    ("WritableStream"   in globalThis && obj instanceof WritableStream) ||
    ("TransformStream"  in globalThis && obj instanceof TransformStream) ||
    ("AudioData"        in globalThis && obj instanceof AudioData) ||
    ("ImageBitmap"      in globalThis && obj instanceof ImageBitmap) ||
    ("VideoFrame"       in globalThis && obj instanceof VideoFrame) ||
    ("OffscreenCanvas"  in globalThis && obj instanceof OffscreenCanvas) ||
    ("RTCDataChannel"   in globalThis && obj instanceof RTCDataChannel); 
}

function filterOutDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// Get transferable objects from an object
function getTransferables(obj: unknown): Transferable[] {
  if (isTypedArray(obj)) {
    const buffer = (obj as TypeTypedArray).buffer;
    return [buffer];
  } else if (isTransferable(obj)) {
    return [obj as Transferable];
  } else if (Array.isArray(obj)) {
    const transferables = obj.flatMap(x => getTransferables(x));
    return filterOutDuplicates(transferables);
  } else if (isObject(obj)) {
    const transferables = Object.values(obj).flatMap(x => getTransferables(x));
    return filterOutDuplicates(transferables);
  }

  return [];
}

// Check is object contains transferable objects
function hasTransferables(obj: unknown): boolean {
  if (isTypedArray(obj) || isTransferable(obj)) {
    return true;
  } else if (Array.isArray(obj)) {
    return obj.flatMap(x => hasTransferables(x)).includes(true);
  } else if (isObject(obj)) {
    return Object.values(obj).flatMap(x => hasTransferables(x)).includes(true);
  } else {
    return false;
  }
}

/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const transferableTransferHandler: TransferHandler<object, TypeTypedArray | Transferable> = {
  canHandle(obj): obj is object {
    return hasTransferables(obj);
  },
  serialize(obj) {
    return [
      obj,
      getTransferables(obj),
    ];
  },
  deserialize(obj) {
    return obj;
  },
};

Comlink.transferHandlers.set("transferable", transferableTransferHandler);