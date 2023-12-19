/**
 * LRU main class
 */
export class LRU<T> {
  /**
   * Capacity limit
   */
  #max: number;

  /**
   * LRU map String:any
   */
  #cache: Map<string, T>;

  /**
   * Constructor method for a new LRU
   * @param max Cache capacity
   */
  constructor(max: number) {
    this.#max = max;
    this.#cache = new Map();
  }

  /**
   * Use it for..of method
   */
  public [Symbol.iterator]() {
    const iterator = this.#cache[Symbol.iterator]();
    return {
      next: () => iterator.next(),
    };
  }

  /**
   * Amount of entries in the cache
   * @returns current size of cache
   */
  public get size(): number {
    return this.#cache.size;
  }

  /**
   * Get entries as object
   * @returns Object with all entries
   */
  public get object(): { [key: string]: T } {
    return Object.fromEntries(this.#cache);
  }

  /**
   * Get all values from cache
   * @returns Array of all values
   */
  public get values(): Array<T> {
    return Array.from(this.#cache.values());
  }

  /**
   * Get all keys from cache
   * @returns Array of all keys
   */
  public get keys(): Array<string> {
    return Array.from(this.#cache.keys());
  }

  /**
   * Executes a provided function once for each array element
   * @param callbackfn Function to execute on each element. It accepts between one and three arguments
   * @param thisArg Value to use as this when executing callback
   */
  public forEach(
    callbackfn: (
      value: T,
      key: string,
      map: Map<string, T>,
    ) => void,
    thisArg?: unknown,
  ): void {
    return this.#cache.forEach(callbackfn, thisArg);
  }

  /**
   * Method creates a new array populated with the results of calling a provided function on every element in the calling array
   * @param callbackfn Function that is called for every element of arr. Each time callback executes, the returned value is added to new_array
   * @param thisArg Value to use as this when executing callback
   */
  public map(
    callbackfn: (
      value: [string, T],
      index: number,
      array: [string, T][],
    ) => T,
    thisArg?: unknown,
  ): T[] {
    return Array.from(this.#cache).map(callbackfn, thisArg);
  }

  /**
   * Creates a new array with all elements that pass the test implemented by the provided function
   * @param callbackfn Function is a predicate, to test each element of the array. Return true to keep the element, false otherwise
   * @param thisArg Value to use as this when executing callback.
   */
  public filter(
    callbackfn: (
      value: [string, T],
      index: number,
      array: [string, T][],
    ) => T,
    thisArg?: unknown,
  ): [string, T][] {
    return Array.from(this.#cache).filter(callbackfn, thisArg);
  }

  /**
   * Executes a reducer function (that you provide) on each element of the array, resulting in single output value
   * @param callbackfn A function to execute on each element in the array (except for the first, if no initialValue is supplied)
   * @param initialValue A value to use as the first argument to the first call of the callback. If no initialValue is supplied, the first element in the array will be used as the initial accumulator value and skipped as currentValue. Calling reduce() on an empty array without an initialValue will throw a TypeError.
   */
  public reduce(
    callbackfn: (
      previousValue: [string, T],
      currentValue: [string, T],
      currentIndex: number,
      array: [string, T][],
    ) => [string, T],
    initialValue?: [string, T],
  ): [string, T];
  public reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: [string, T],
      currentIndex: number,
      array: [string, T][],
    ) => U,
    initialValue: U,
  ): U;
  // deno-lint-ignore no-explicit-any
  public reduce(callbackfn: any, initialValue?: any): any {
    return Array.from(this.#cache).reduce(callbackfn, initialValue);
  }

  /**
   * Removes all entries in the cache
   */
  public clear(): void {
    this.#cache.clear();
  }

  /**
   * Returns a boolean indicating whether an element with the specified key exists or not
   * @param key The key of the element to test for presence in the cache
   * @returns true if an element with the specified key exists in the cache otherwise false
   */
  public has(key: string): boolean {
    return this.#cache.has(key);
  }

  /**
   * Attemps to retrieve a value from the cache
   * @param key The key of the entry to return from the cache
   * @returns the value associated to the input key or undefined
   */
  public get(key: string): T | undefined {
    const item = this.#cache.get(key);
    if (!item) return undefined;
    this.remove(key);
    this.#cache.set(key, item);
    return item;
  }

  /**
   * Removes the entry
   * @param key key is used to remove from the cache
   */
  public remove(key: string): void {
    this.#cache.delete(key);
  }

  /**
   * Adds or updates an entry in the cache
   *
   * @param key new entry key
   * @param value new entry value
   */
  public set(key: string, value: T): void {
    if (this.has(key)) this.remove(key);
    else if (this.size === this.#max) this.remove(this._first());
    this.#cache.set(key, value);
  }

  /**
   * Get the oldest entry in the cache
   * @returns value of the oldest entry
   */
  private _first() {
    return this.#cache.keys().next().value;
  }
}

export default LRU;
