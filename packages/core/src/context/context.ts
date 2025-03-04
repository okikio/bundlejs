import type { ESBUILD } from "../types.ts";
// import type { record } from "@libs/reactive";
// import { Context } from "@libs/reactive";

// Imports
import type { Nullable, record } from "@libs/typing"
import type { DeepMerge } from "@std/collections/deep-merge"
export type { DeepMerge, record }

/**
 * Reactive context.
 *
 * Create an object where every `get`, `set`, `delete`, and `call` operations are observable.
 * These events can be tracked using the `EventTarget` interface. Observability is applied
 * recursively to all properties of the object, including functions and collections such as
 * `Map`, `Set`, and `Array`.
 *
 * ## Key Concepts
 *
 * ### Isolated Data
 * - **Isolated data** refers to properties that are explicitly defined in a child context and do not
 *   affect or inherit from the parent context's properties. Changes made to isolated data in a child
 *   context do not propagate back to the parent context or affect sibling contexts.
 * - **Example**: When creating a child context, you can specify new properties or reassign existing
 *   ones. These properties are isolated to that child context unless explicitly shared back with the
 *   parent.
 *
 * ### Shared Data
 * - **Shared data** refers to properties that are inherited from the parent context. These properties
 *   can be accessed and modified by child contexts. Changes made to shared data in a child context
 *   propagate back to the parent context.
 * - **Example**: Shared data is inherited from the parent context by default. When a child modifies
 *   shared data, the changes are reflected across all contexts that share the same data.
 *
 * ## Key Features
 *
 * 1. **Observable Properties**:
 *    - Properties in the context can be tracked and reacted to via events like `get`, `set`, `delete`,
 *      and `call`.
 *
 * 2. **Context Inheritance**:
 *    - Child contexts inherit properties from their parent contexts, making it easy to share
 *      data across multiple related contexts.
 *    - Properties set in a child context can override parent context properties, but inherited
 *      properties are still accessible unless explicitly overridden.
 *
 * 3. **Handling of Native Classes**:
 *    - Specific native classes such as `Set`, `Map`, `ArrayBuffer`, `WeakMap`, and others are handled
 *      carefully to avoid proxy-related issues. These objects are accessed directly without
 *      unnecessary proxy traps.
 *
 * 4. **Bidirectional Data Flow**:
 *    - Inherited properties propagate down to child contexts, and changes to shared properties reflect
 *      back up to parent contexts. Isolated properties remain unique to the child context.
 *
 * **Note:** Properties specified in `.with({ ... })` are automatically isolated from the parent
 * and sibling contexts. This means that properties defined or modified in a child context do not
 * propagate to parent or sibling contexts unless explicitly shared.
 *
 * @example Example: Observing Property Changes in a Context
 * This example demonstrates the setup of listeners for observing `get`, `set`, `delete`, and `call` operations.
 * We initialize a context and attach listeners to capture events as we interact with the context's target object.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({ foo: "bar", bar: () => null });
 *
 * // Attach listeners
 * context.addEventListener("get", ({detail:{property}}: any) => console.log(`get: ${property}`));
 * context.addEventListener("set", ({detail:{property, value}}: any) => console.log(`set: ${property}: ${value.old} => ${value.new}`));
 * context.addEventListener("delete", ({detail:{property}}: any) => console.log(`delete: ${property}`));
 * context.addEventListener("call", ({detail:{property, args}}: any) => console.log(`call: ${property}(${args.join(", ")})`));
 * context.addEventListener("change", ({detail:{type}}: any) => console.log(`change: ${type}`));
 *
 * // Operate on the context
 * context.target.foo = "baz";  // Triggers the "set" and "change" events
 * context.target.bar();        // Triggers the "call" and "change" events
 * ```
 *
 * @example Example: Basic Usage with Shared and Isolated Properties
 * This example illustrates how shared and isolated properties work across contexts. Shared properties are accessible
 * and modifiable across contexts, whereas isolated properties remain unique to each context.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const parentContext = new Context({
 *   setOfUrls: new Set<string>(),   // Shared across contexts
 *   isolatedSetOfUrls: new Set<string>(), // Isolated to each child context
 *   name: "ParentContext",
 * });
 *
 * const childContext = parentContext.with({
 *   name: "ChildContext",           // Isolated in child context
 * });
 *
 * // Modify isolated and shared properties
 * childContext.target.isolatedSetOfUrls.add("bar");  // Only affects the child context
 * childContext.target.setOfUrls.add("https://child.com");  // Affects all contexts sharing this property
 *
 * console.log(parentContext.target.setOfUrls);  // Includes 'https://child.com'
 * console.log(childContext.target.isolatedSetOfUrls);  // Only 'bar' in the child context
 * ```
 *
 * @example Example: Accessing Properties Across Multiple Levels of Context
 * This example demonstrates how properties are inherited across multiple context levels and how updates propagate.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const parentContext = new Context({ foo: "parent value" });
 * const childContext = parentContext.with({ bar: "child value" });
 * const grandchildContext = childContext.with({ baz: "grandchild value" });
 *
 * // Access inherited properties across levels
 * console.log(grandchildContext.target.foo); // "parent value" (inherited from parentContext)
 * console.log(grandchildContext.target.bar); // "child value" (inherited from childContext)
 * console.log(grandchildContext.target.baz); // "grandchild value" (from grandchildContext)
 *
 * // Updating a shared property propagates to the parent context
 * grandchildContext.target.foo = "updated value";
 * console.log(parentContext.target.foo); // "updated value"
 * ```
 *
 * @example Example: Handling Native Classes with Proxies
 * This example shows how native classes such as `Set` and `Map` are handled within a context, allowing
 * seamless modification without proxy interference.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({
 *   mySet: new Set([1, 2, 3]),
 *   myMap: new Map([["key", "value"]]),
 * });
 *
 * // Add to the set and update the map
 * context.target.mySet.add(4);
 * context.target.myMap.set("newKey", "newValue");
 *
 * console.log(context.target.mySet); // Set { 1, 2, 3, 4 }
 * console.log(context.target.myMap); // Map { "key" => "value", "newKey" => "newValue" }
 * ```
 *
 * @example Example: Shared and Isolated Data with Buffer and Date
 * This example highlights how `ArrayBuffer` and `Date` instances can be shared across contexts or isolated to specific contexts.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({
 *   buffer: new ArrayBuffer(16),  // Shared buffer
 *   currentDate: new Date(),      // Shared Date
 * });
 *
 * const childContext = context.with({
 *   buffer: new ArrayBuffer(32),  // Isolated buffer
 * });
 *
 * const grandchildContext = childContext.with({
 *   currentDate: new Date("2025-01-01T00:00:00Z"),  // Isolated Date
 * });
 *
 * // Check data in different contexts
 * console.log(context.target.buffer.byteLength);  // 16 bytes (shared)
 * console.log(childContext.target.buffer.byteLength);  // 32 bytes (isolated)
 * console.log(grandchildContext.target.currentDate);  // 2025-01-01T00:00:00.000Z
 * ```
 *
 * @example Example: Working with WeakMap, WeakSet, and Symbol
 * This example shows how `WeakMap`, `WeakSet`, and `Symbol` are handled within the context, with support for
 * isolated symbols across child contexts.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const weakMap = new WeakMap<object, number>();
 * const symbolKey = Symbol("uniqueKey");
 * const context = new Context({ weakMap, symbolKey });
 *
 * const obj = {};
 * context.target.weakMap.set(obj, 123);
 *
 * const childContext = context.with({
 *   symbolKey: Symbol("childSymbol"),  // Isolated Symbol
 * });
 *
 * console.log(context.target.weakMap.get(obj));  // 123 (shared WeakMap)
 * console.log(childContext.target.symbolKey);    // Symbol("childSymbol") (isolated Symbol)
 * ```
 *
 * @example Example: Streams and Transferables
 * This example demonstrates how `ReadableStream` and `WritableStream` can be utilized within the context
 * and connected via the `pipeTo` method.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const readableStream = new ReadableStream({
 *   start(controller) {
 *     controller.enqueue("data");
 *     controller.close();
 *   },
 * });
 *
 * const writableStream = new WritableStream({
 *   write(chunk) {
 *     console.log(chunk);  // "data"
 *   },
 * });
 *
 * const context = new Context({ readable: readableStream, writable: writableStream });
 *
 * const childContext = context.with({});
 *
 * childContext.target.readable.pipeTo(childContext.target.writable);
 * ```
 *
 * @example Example: Using AudioData and VideoFrame (for environments that support them)
 * This example highlights the handling of `AudioData` and `VideoFrame` objects in contexts that support them,
 * such as web browsers with media capabilities.
 *
 * ```ts
 * import { Context } from "./context.ts"
 *
 * // @ts-ignore Some runtimes don't support AudioData
 * const audioData = new AudioData({ numberOfChannels: 1, sampleRate: 44100, timestamp: 0 });
 * // @ts-ignore Some runtimes don't support VideoFrame
 * const videoFrame = new VideoFrame({ displayWidth: 1920, displayHeight: 1080 });
 *
 * const context = new Context({ audio: audioData, video: videoFrame });
 *
 * const childContext = context.with({
 *   // @ts-ignore Some runtimes don't support VideoFrame
 *   video: new VideoFrame({ displayWidth: 1280, displayHeight: 720 }),  // Isolated VideoFrame
 * });
 *
 * console.log(context.target.video.displayWidth);  // 1920 (shared)
 * console.log(childContext.target.video.displayWidth);  // 1280 (isolated)
 * ```
 * @author Simon Lecoq (lowlighter)
 * @license MIT
 * @module
 */
export class Context<T extends record = record> extends EventTarget {
  /** Constructor. */
  constructor(target = {} as T, { parent = null as Nullable<Context<record>> } = {}) {
    super()
    this.#parent = parent
    this.#target = target
    this.#isolated = new Set(Object.keys(this.#target))
    this.target = this.#proxify(this.#target)
  }

  /**
   * Parent {@link Context}.
   * Properties not found in the current context will be searched in the parent context.
   */
  readonly #parent: Nullable<Context<record>>

  /**
   * Children {@link Context | Contexts}.
   * Any property change in the parent context will be dispatched to the children contexts.
   */
  readonly #children = new Set<Context<record>>()

  /**
   * A set of properties that are considered isolated in the current {@link Context | context}.
   *
   * - **Isolated properties** are those that are explicitly defined in a child context.
   * - These properties do not propagate changes to the parent context or sibling contexts.
   * - Changes made to isolated properties in the child context are restricted to that context
   *   and do not affect shared data or other contexts.
   */
  readonly #isolated: Set<PropertyKey>

  /**
   * Actual target value.
   * This value is not proxified.
   */
  readonly #target

  /**
   * Observable target value.
   * This value is proxified.
   */
  readonly target: T

  /** Instantiate a new inherited {@link Context} with superseded value. */
  with<U extends record>(target: U): Context<DeepMerge<T, U>> {
    const context = new Context(target, { parent: this })
    this.#children.add(context)
    return context as Context<DeepMerge<T, U>>
  }

  /** Access target value from a property path. */
  #access(path = [] as PropertyKey[]) {
    return path.reduce((value, property) => (value as target)?.[property], this.#target)
  }

  /**
   * Proxified cache.
   * Used to avoid creating multiple proxies for the same object.
   */
  readonly #cache = new WeakMap()

  /**
   * Proxify an object.
   *
   * This method creates a proxy for the target object and attaches traps for `get`, `set`,
   * `delete`, and other operations. The traps are designed to enforce the observable nature
   * of the context, while respecting the rules for specific native classes and types.
   *
   * Example:
   * ```ts
   * import { Context } from "./context.ts"
   *
   * const context = new Context({ foo: "bar" });
   * const proxied = context.target; // Returns a proxied object
   * ```
   *
   * @param target - The object to proxify.
   * @param path - The property path associated with the object (default is an empty array).
   * @returns A proxied version of the target object.
   */
  #proxify(target: target, { path = [] as PropertyKey[] } = {}) {
    return new Proxy(target, this.#trap(target, path))
  }

  /**
   * Generate trap handlers.
   * Handlers are different depending on whether the target is a function or an object at root path.
   */
  #trap(target: target, path: PropertyKey[] = []) {
    if (typeof target === "function") {
      return { apply: this.#trap_apply.bind(this, path) }
    }
    const traps = {
      get: this.#trap_get.bind(this, path),
      set: this.#trap_set.bind(this, path),
      deleteProperty: this.#trap_delete.bind(this, path),
    }
    if ((this.#parent) && (!path.length)) {
      Object.assign(traps, {
        has: this.#trap_has.bind(this),
        ownKeys: this.#trap_keys.bind(this),
        getOwnPropertyDescriptor: this.#trap_descriptors.bind(this),
      })
    }
    return traps
  }

  /**
   * Trap function calls.
   *
   * This trap has been updated to handle native classes like `Map` and `Set`,
   * ensuring that these objects are not proxied. Additionally, the trap now correctly
   * accesses properties across multiple context levels.
   *
   * Example:
   * ```ts
   * import { Context } from "./context.ts"
   *
   * const context = new Context({ setFunc: new Set([1, 2, 3]) });
   * context.target.setFunc.add(4); // Works correctly without proxy interference
   * ```
   *
   * @param path - The path to the function being called.
   * @param callable - The function to call.
   * @param that - The `this` context for the function call.
   * @param args - The arguments to pass to the function.
   * @returns The result of the function call.
   */
  #trap_apply(path: PropertyKey[], callable: trap<"apply", 0>, that: trap<"apply", 1>, args: trap<"apply", 2>) {
    try {
      return Reflect.apply(callable, that, args)
    } finally {
      const target = this.#access(path.slice(0, -1))
      const property = path.at(-1)!
      if (target && Reflect.has(target, property)) {
        this.#dispatch("call", { path, target, property, args })
      }
    }
  }

  /**
   * Trap property access.
   *
   * This trap has been updated to correctly access properties across multiple levels
   * in the context hierarchy, as well as handling specific native classes and types
   * that should not be proxied.
   *
   * Example:
   * ```ts
   * import { Context } from "./context.ts"
   *
   * const parent = new Context({ foo: "parent" });
   * const child = parent.with({ bar: "child" });
   *
   * console.log(child.target.foo); // Accesses "foo" from parent context
   * ```
   *
   * @param path - The path to the property being accessed.
   * @param target - The target object.
   * @param property - The property key.
   * @returns The value of the property.
   */
  #trap_get(path: PropertyKey[], target: trap<"get", 0>, property: trap<"get", 1>) {
    if ((this.#parent) && (!path.length)) {
      if (!this.#isolated.has(property) && !Reflect.has(target, property)) {
        return Reflect.get(this.#parent.target, property)
      }
    }

    const value = Reflect.get(target, property)
    try {
      if (value) {
        let proxify = false
        if (typeof value === "function") {
          // Skip and constructors
          if ((property === "constructor") && (value !== Object.prototype.constructor)) {
            return value
          }
          proxify = true
        } else if (typeof value === "object") {
          // Skip some built-in objects
          if (Context.#isNotProxyable(value)) {
            return value
          }
          proxify = true
        }
        if (proxify) {
          if (!this.#cache.has(value)) {
            this.#cache.set(value, this.#proxify(value, { path: [...path, property] }))
          }
          return this.#cache.get(value)
        }
      }
      return value
    } finally {
      this.#dispatch("get", { path, target, property, value })
    }
  }

  /** Trap property assignment. */
  #trap_set(path: PropertyKey[], target: trap<"set", 0>, property: trap<"set", 1>, value: trap<"set", 2>) {
    if ((this.#parent) && (!path.length) && (!Reflect.has(this.#target, property)) && (Reflect.has(this.#parent.target, property)) && !this.#isolated.has(property)) {
      return Reflect.set(this.#parent.target, property, value)
    }

    const old = Reflect.get(target, property)
    try {
      return Reflect.set(target, property, value)
    } finally {
      this.#dispatch("set", { path, target, property, value: { old, new: value } })
    }
  }

  /** Trap property deletion. */
  #trap_delete(path: PropertyKey[], target: trap<"deleteProperty", 0>, property: trap<"deleteProperty", 1>) {
    if ((this.#parent) && (!path.length) && (!Reflect.has(this.#target, property)) && (Reflect.has(this.#parent.target, property)) && !this.#isolated.has(property)) {
      return Reflect.deleteProperty(this.#parent.target, property)
    }

    const deleted = Reflect.get(target, property)
    try {
      return Reflect.deleteProperty(target, property)
    } finally {
      this.#dispatch("delete", { path, target, property, value: deleted })
    }
  }

  /** Trap property keys. */
  #trap_keys(target: trap<"ownKeys", 0>) {
    const isolatedKeys = this.#isolated // Convert isolated Set to array
    const parentKeys = Reflect.ownKeys(this.#parent!.target)
    const targetKeys = Reflect.ownKeys(target)

    // Create the filtered result
    const allKeys = Array.from(new Set(parentKeys.concat(targetKeys)))
      .filter((key) => {
        const inIsolated = isolatedKeys.has(key)
        const inTarget = targetKeys.includes(key)

        // Keep the key if:
        // - It is in both isolatedKeys and targetKeys (keep it)
        // - It is not in isolatedKeys (keep it)
        return (inIsolated && inTarget) || !inIsolated
      })

    return allKeys
  }

  /** Trap property descriptors. */
  #trap_descriptors(target: trap<"getOwnPropertyDescriptor", 0>, property: trap<"getOwnPropertyDescriptor", 1>) {
    const descriptor = Reflect.getOwnPropertyDescriptor(target, property)
    return descriptor ?? (!this.#isolated.has(property) ? Reflect.getOwnPropertyDescriptor(this.#parent!.target, property) : descriptor)
  }

  /** Trap property existence tests. */
  #trap_has(target: trap<"has", 0>, property: trap<"has", 1>) {
    return Reflect.has(target, property) || (!this.#isolated.has(property) && Reflect.has(this.#parent!.target, property))
  }

  /** Dispatch event. */
  #dispatch(type: string, detail: Omit<detail, "type">) {
    Object.assign(detail, { type })
    this.dispatchEvent(new Context.Event(type, { detail }))
    if ((type === "set") || (type === "delete") || (type === "call")) {
      this.dispatchEvent(new Context.Event("change", { detail }))
    }

    this.dispatchEvent(new Context.Event("all", { detail }))
    for (const child of this.#children) {
      const property = detail.path[0] ?? detail.property
      if (!child.#isolated.has(property) && !Reflect.has(child.#target, property)) {
        child.#dispatch(type, detail)
      }
    }
  }

  /**
   * Check if object is a native class or type that should not be proxied.
   *
   * The following objects are avoided by default because:
   *
   * - **Map, Set, WeakMap, WeakSet**: These collections have internal slots that rely on the object being intact for correct behavior.
   * - **WeakRef**: Holds a weak reference to an object, preventing interference with garbage collection.
   * - **Promise**: Proxying promises can interfere with their state management and chaining.
   * - **Error**: Proxying errors can disrupt stack traces and error handling mechanisms.
   * - **RegExp**: Regular expressions rely on internal optimizations that can be disrupted by proxying.
   * - **Date**: Dates have special methods like `getTime()` and `toISOString()` that are tightly coupled with the internal state of the `Date` object.
   * - **ArrayBuffer, TypedArray**: These represent binary data and are performance-critical. Proxying them could cause significant performance degradation.
   * - **Function**: Functions have special behavior when called or applied. Proxying can lead to unexpected side effects.
   * - **Symbol**: Symbols are unique and immutable, making proxying unnecessary and potentially harmful.
   * - **BigInt**: BigInts are immutable and behave like primitives; proxying them is not meaningful.
   * - **Intl Objects**: Objects like `Intl.DateTimeFormat`, `Intl.NumberFormat`, and `Intl.Collator` are optimized for locale-aware formatting and should not be altered.
   * - **MessagePort, MessageChannel, Worker, SharedWorker**: Used for communication between contexts; proxying could disrupt message-passing mechanisms.
   * - **ImageBitmap**: Represents image data optimized for performance; proxying could slow down rendering operations.
   * - **OffscreenCanvas**: Enables off-main-thread rendering; proxying could break parallel rendering tasks.
   * - **ReadableStream, WritableStream, TransformStream**: Streams are designed for efficient data handling. Proxying could introduce latency or disrupt data flow.
   * - **AudioData, VideoFrame**: Media-related transferables used in real-time processing; proxying could cause performance issues.
   *
   * @param obj - The object to check.
   * @returns `true` if the object is a native class or type that should not be proxied, otherwise `false`.
   */
  static #isNotProxyable(obj: unknown): boolean {
    return (
      ("Map" in globalThis && obj instanceof globalThis.Map) ||
      ("Set" in globalThis && obj instanceof globalThis.Set) ||
      ("WeakMap" in globalThis && obj instanceof globalThis.WeakMap) ||
      ("WeakSet" in globalThis && obj instanceof globalThis.WeakSet) ||
      ("WeakRef" in globalThis && obj instanceof globalThis.WeakRef) ||
      ("Promise" in globalThis && obj instanceof globalThis.Promise) ||
      ("Error" in globalThis && obj instanceof globalThis.Error) ||
      ("RegExp" in globalThis && obj instanceof globalThis.RegExp) ||
      ("Date" in globalThis && obj instanceof globalThis.Date) ||
      ("ArrayBuffer" in globalThis && obj instanceof globalThis.ArrayBuffer) ||
      ("ArrayBuffer" in globalThis && globalThis.ArrayBuffer.isView(obj)) || // Covers TypedArrays (Uint8Array, Float32Array, etc.)
      ("Function" in globalThis && obj instanceof globalThis.Function) ||
      ("BigInt" in globalThis && typeof obj === "bigint") ||
      ("Symbol" in globalThis && typeof obj === "symbol") ||
      ("Intl" in globalThis && "DateTimeFormat" in globalThis.Intl && obj instanceof globalThis.Intl.DateTimeFormat) ||
      ("Intl" in globalThis && "NumberFormat" in globalThis.Intl && obj instanceof globalThis.Intl.NumberFormat) ||
      ("Intl" in globalThis && "Collator" in globalThis.Intl && obj instanceof globalThis.Intl.Collator) ||
      ("Worker" in globalThis && obj instanceof globalThis.Worker) ||
      // @ts-ignore Not all environments support SharedWorkers
      ("SharedWorker" in globalThis && obj instanceof globalThis.SharedWorker) ||
      ("MessageChannel" in globalThis && obj instanceof globalThis.MessageChannel) ||
      ("MessagePort" in globalThis && obj instanceof globalThis.MessagePort) ||
      ("ImageBitmap" in globalThis && obj instanceof globalThis.ImageBitmap) ||
      // @ts-ignore Deno doesn't support `OffscreenCanvas`, but the browsers do
      ("OffscreenCanvas" in globalThis && obj instanceof globalThis.OffscreenCanvas) ||
      ("ReadableStream" in globalThis && obj instanceof globalThis.ReadableStream) ||
      ("WritableStream" in globalThis && obj instanceof globalThis.WritableStream) ||
      ("TransformStream" in globalThis && obj instanceof globalThis.TransformStream) ||
      // @ts-ignore Deno doesn't support `AudioData`, but the browsers do
      ("AudioData" in globalThis && obj instanceof globalThis.AudioData) ||
      // @ts-ignore Deno doesn't support `VideoFrame`, but the browsers do
      ("VideoFrame" in globalThis && obj instanceof globalThis.VideoFrame)
    )
  }

  /** Context event. */
  static readonly Event = class ContextEvent extends CustomEvent<detail> { } as typeof CustomEvent
}

/** Context target. */
// deno-lint-ignore no-explicit-any
export type target = any

/** Context event detail. */
type detail = { type: string; path: PropertyKey[]; target: target; property: PropertyKey; value?: unknown; args?: unknown[] }

/** Trap arguments. */
// deno-lint-ignore ban-types
type trap<K extends keyof ProxyHandler<object>, I extends number> = K extends "apply" ? Parameters<NonNullable<ProxyHandler<Function>[K]>>[I] : Parameters<NonNullable<ProxyHandler<object>[K]>>[I]

export interface GlobalState extends record {
  /**
   * Registers if esbuild has been initialized
   */
  initialized: boolean;

  /**
   * Instance of esbuild being used
   */
  esbuild: typeof ESBUILD | null;
}

/**
 * Global reactive context.
 *
 * This context is used to store global state that can be observed and reacted to. 
 * It creates an object where every get, set, delete, and call operations are observable.
 * These events can be reacted to using the `EventTarget` interface.
 * Observability is applied recursively to all properties of the object.
 *
 * The context also tracks function calls, making it possible to track updates to keyed collections such as `Map`, `Set`, and `Array`.
 *
 * @example
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const context = new Context({ foo: "bar", bar: () => null })
 *
 * // Attach listeners
 * context.addEventListener("get", ({detail:{property}}:any) => console.log(`get: ${property}`))
 * context.addEventListener("set", ({detail:{property, value}}:any) => console.log(`set: ${property}: ${value.old} => ${value.new}`))
 * context.addEventListener("delete", ({detail:{property}}:any) => console.log(`delete: ${property}`))
 * context.addEventListener("call", ({detail:{property, args}}:any) => console.log(`call: ${property}(${args.join(", ")})`))
 * context.addEventListener("change", ({detail:{type}}:any) => console.log(`change: ${type}`))
 *
 * // Operate on context
 * context.target.foo = "baz"
 * context.target.bar()
 * ```
 *
 * It is possible to create child contexts from a context.
 *
 * Child contexts inherit the parent context properties if they're left undefined.
 * In this case, changes will be effective bidirectionally (both the parent and child will have the same reference, meaning that
 * operations performed on parent value are applied on child value and vice-versa).
 *
 * If a property is defined in the child context, changes will only be effective in the child context.
 *
 * @example
 * ```ts
 * import { Context } from "./context.ts"
 *
 * const a = new Context({ foo: "bar" })
 * const b = a.with({ bar: "baz" })
 *
 * console.assert("foo" in a.target)
 * console.assert(!("bar" in a.target))
 * console.assert("foo" in b.target)
 * console.assert("bar" in b.target)
 * ```
 *
 * @see {@link Context}
 * @see {@link fromContext}
 * @see {@link toContext}
 */
export const GlobalContext = new Context<GlobalState>({
  initialized: false,
  assets: [],
  esbuild: null,
});

/**
 * Gets a value from a context.
 * 
 * This function retrieves a value from the specified context based on the provided key.
 * If no context is provided, it defaults to the `GlobalContext`.
 * 
 * @param name The key to get the value from.
 * @param ctx The context to get the value from. Defaults to `GlobalContext`.
 * @returns The value that was retrieved, or `null` if the key does not exist in the context.
 * 
 * @example
 * ```ts
 * const value = fromContext("foo");
 * console.log(value); // Outputs the value of "foo" from the context
 * ```
 * 
 * @see {@link GlobalContext}
 * @see {@link toContext}
 */
export function fromContext<T extends keyof State | (string & {}), State extends record = GlobalState>(
  name?: T,
  ctx: Context<State> = GlobalContext as unknown as Context<State>
): State[T] | null {
  return name && name in ctx.target ? ctx.target[name] : null;
}

/**
 * Sets a value to a context.
 * 
 * This function sets a value in the specified context based on the provided key.
 * If no context is provided, it defaults to the `GlobalContext`.
 * 
 * @param name The key to set the value to.
 * @param value The value to set.
 * @param ctx The context to set the value to. Defaults to `GlobalContext`.
 * @returns The value that was set.
 * 
 * @example
 * ```ts
 * toContext("foo", "bar");
 * console.log(toContext("foo")); // Outputs "bar"
 * ```
 * 
 * @see {@link GlobalContext}
 * @see {@link fromContext}
 */
export function toContext<T extends keyof State, State extends Record<PropertyKey, unknown> = GlobalState>(
  name: T,
  value: State[T],
  ctx: Context<State> = GlobalContext as unknown as Context<State>
): State[T] {
  ctx.target[name] = value;
  return value;
}

/**
 * Creates a new context by merging the provided value with the existing context.
 * 
 * This function takes a new state object and merges it with the existing context to create a new context.
 * If no context is provided, it defaults to the `GlobalContext`.
 * 
 * @template NewState - The type of the new state to be merged.
 * @template State - The type of the existing state in the context. Defaults to `GlobalState`.
 * 
 * @param value - The new state object to be merged with the existing context.
 * @param ctx - The existing context to merge the new state with. Defaults to `GlobalContext`.
 * 
 * @returns A new context that includes both the existing state and the new state.
 * 
 * @example
 * ```ts
 * import { withContext, GlobalContext } from "./context";
 * 
 * const newState = { foo: "bar" };
 * const newContext = withContext(newState);
 * 
 * console.log(newContext.target.foo); // Outputs: "bar"
 * ```
 * 
 * @see {@link Context}
 * @see {@link GlobalContext}
 */
export function withContext<NewState extends Record<PropertyKey, unknown>, State extends Record<PropertyKey, unknown> = GlobalState>(
  value: NewState,
  ctx: Context<State> = GlobalContext as unknown as Context<State>,
): Context<State> {
  const newContext = ctx.with(value) as Context<State & NewState>;
  return newContext;
}
