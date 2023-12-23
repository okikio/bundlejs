// Using TypeScript and ES2022 features
/**
 * Provides a lightweight side channel mechanism.
 * This is used to store and retrieve values associated with objects or keys,
 * especially helpful in managing state or context without modifying the original object.
 */
export class SideChannel {
  private weakMap: WeakMap<object, any>;
  private map: Map<any, any>;
  private list: { key: any, next: { key: any, next: any, value: any } | null, value: any } | null;

  constructor() {
    this.weakMap = new WeakMap();
    this.map = new Map();
    this.list = { key: {}, next: null, value: undefined };
  }

  assert(key: any): void {
    if (!this.has(key)) {
      throw new TypeError(`Side channel does not contain ${(key)}`);
    }
  }

  get(key: any): any {
    if (typeof key === 'object' || typeof key === 'function') {
      return this.weakMap.get(key);
    }
    return this.map.get(key) ?? this.listGet(key);
  }

  has(key: any): boolean {
    if (typeof key === 'object' || typeof key === 'function') {
      return this.weakMap.has(key);
    }
    return this.map.has(key) || this.listHas(key);
  }

  set(key: any, value: any): void {
    if (typeof key === 'object' || typeof key === 'function') {
      this.weakMap.set(key, value);
    } else {
      this.map.set(key, value);
    }
  }

  private listGetNode(key: any): any {
    let prev = this.list;
    let curr = prev?.next;
    while (curr !== null) {
      if (curr.key === key) {
        prev!.next = curr.next;
        curr.next = this.list!.next;
        this.list!.next = curr;
        return curr;
      }
      prev = curr;
      curr = curr.next;
    }
    return undefined;
  }

  private listGet(key: any): any {
    const node = this.listGetNode(key);
    return node && node.value;
  }

  private listSet(key: any, value: any): void {
    const node = this.listGetNode(key);
    if (node) {
      node.value = value;
    } else {
      this.list!.next = { key, next: this.list!.next, value };
    }
  }

  private listHas(key: any): boolean {
    return !!this.listGetNode(key);
  }
}

export function getSideChannel(): SideChannel {
  return new SideChannel();
}
