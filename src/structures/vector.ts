type Factory<T, A extends unknown[]> = (...args: A) => T

interface VectorOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

export class Vector<T, A extends unknown[] = [T]> extends Array<T> {
  #factory?: Factory<T, A>

  constructor({ initValues = [], factory }: VectorOptions<T, A> = {}) {
    super(...initValues)
    Object.setPrototypeOf(this, Vector.prototype)
    this.#factory = factory
  }

  *rbegin(): IterableIterator<T> {
    for (let i = this.length - 1; i >= 0; i--) {
      yield this[i] as T
    }
  }

  begin(): IterableIterator<T> {
    return this[Symbol.iterator]()
  }

  public isEmpty(): boolean {
    return this.length === 0
  }

  public clear(): void {
    this.length = 0
  }

  public insertAt(index: number, val: T): number {
    if (arguments.length < 2) return this.length
    if (typeof index !== 'number' || index < 0 || index > this.length) {
      throw new RangeError('Index out of range')
    }
    this.splice(index, 0, val)
    return this.length
  }

  public eraseAt(index: number): T | undefined {
    if (typeof index !== 'number' || index < 0 || index >= this.length) {
      throw new RangeError('Index out of range')
    }
    const [item] = this.splice(index, 1)
    return item
  }

  public resize(size: number): void {
    if (!(size >= 0 && size < 2 ** 32)) {
      throw new RangeError(
        "Failed to set the size on 'Vector': Invalid vector length",
      )
    }
    this.length = size
  }

  public pushFront(val: T): number {
    if (arguments.length === 0) return this.length
    return this.unshift(val)
  }

  public pushBack(val: T): number {
    if (arguments.length === 0) return this.length
    return this.push(val)
  }

  public popFront(): T | undefined {
    return this.shift()
  }

  public popBack(): T | undefined {
    return this.pop()
  }

  public emplaceAt(index: number, ...arg: A): number {
    if (arguments.length < 2) return this.length

    if (typeof this.#factory === 'function') {
      return this.insertAt(index, this.#factory(...arg))
    }

    return this.insertAt(index, arg[0] as T)
  }

  public emplaceFront(...arg: A): number {
    if (arguments.length < 1) return this.length

    if (typeof this.#factory === 'function') {
      return this.pushFront(this.#factory(...arg))
    }

    return this.pushFront(arg[0] as T)
  }

  public emplaceBack(...arg: A): number {
    if (arguments.length < 1) return this.length

    if (typeof this.#factory === 'function') {
      return this.pushBack(this.#factory(...arg))
    }

    return this.pushBack(arg[0] as T)
  }

  // Overload signatures
  public assign(count: number, value: T): void
  public assign(values: T[], start?: number, end?: number): void

  // Implementation
  public assign(arg1: number | T[], arg2?: T | number, arg3?: number): void {
    // Case: assign(values: T[], start?: number, end?: number)
    if (Array.isArray(arg1)) {
      const values = arg1
      const start = typeof arg2 === 'number' ? arg2 : 0
      const end = typeof arg3 === 'number' ? arg3 : values.length

      if (start < 0 || end > values.length || start > end) {
        throw new RangeError('Invalid array slice range')
      }

      this.clear()

      for (let i = start; i < end; i++) {
        this.pushBack(values[i]!)
      }
      return
    }

    // Case: assign(count: number, value: T)
    if (typeof arg1 === 'number' && arguments.length === 2) {
      const count = arg1
      const value = arg2 as T

      if (count < 0) {
        throw new RangeError('Count must be a non-negative integer')
      }

      this.clear()

      for (let i = 0; i < count; i++) {
        this.pushBack(value)
      }
      return
    }

    // Invalid usage
    throw new TypeError('Invalid arguments passed to assign()')
  }

  public equals(
    other: Vector<T>,
    compareFn: (a: T, b: T) => boolean = (a, b) => a === b,
  ): boolean {
    if (this.length !== other.length) return false
    return this.every((v, i) => compareFn(v, other[i] as T))
  }

  // setter and getter
  public get front(): T | undefined {
    return this[0]
  }

  public set front(val: T) {
    if (this.isEmpty()) throw new RangeError('Cannot set front on empty vector')
    this[0] = val
  }

  public get back(): T | undefined {
    return this.at(-1)
  }

  public set back(val: T) {
    if (this.isEmpty()) throw new RangeError('Cannot set back on empty vector')
    this[this.length - 1] = val
  }
}
