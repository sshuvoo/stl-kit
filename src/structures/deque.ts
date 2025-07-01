import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface DequeOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

export class Deque<T, A extends unknown[] = [T]> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>

  constructor({ initValues, factory }: DequeOptions<T, A> = {}) {
    this.#head = this.#tail = null
    this.#length = 0
    this.#factory = factory
    this.#initializeFrom(initValues)
  }

  // Iterable
  *[Symbol.iterator](): IterableIterator<T> {
    let current = this.#head
    while (current !== null) {
      yield current.val
      current = current.next
    }
  }

  *rbegin(): IterableIterator<T> {
    let current = this.#tail
    while (current !== null) {
      yield current.val
      current = current.prev
    }
  }

  begin(): IterableIterator<T> {
    return this[Symbol.iterator]()
  }

  // Private methods
  #initializeFrom(initValues?: T[]): void {
    if (initValues === undefined) return

    if (!Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the deque.')
    }

    if (initValues.length === 0) return

    for (const value of initValues) {
      this.pushBack(value)
    }
  }

  // Public method
  public pushFront(value: T): void {
    const newNode = new ListNode(value)

    if (this.isEmpty()) {
      this.#head = this.#tail = newNode
      this.#length++
      return
    }

    this.#head!.prev = newNode
    newNode.next = this.#head
    this.#head = newNode
    this.#length++
  }

  public pushBack(value: T): void {
    const newNode = new ListNode(value)

    if (this.isEmpty()) {
      this.#head = this.#tail = newNode
      this.#length++
      return
    }

    newNode.prev = this.#tail
    this.#tail!.next = newNode
    this.#tail = newNode
    this.#length++
  }

  public popFront(): T | undefined {
    // No node
    if (this.isEmpty()) return

    const removedNode = this.#head!
    const removedValue = removedNode.val

    // Single Node
    if (this.#length === 1) {
      this.#head = this.#tail = null
      removedNode.cleanup()
      this.#length--
      return removedValue
    }

    // Two and more nodes
    this.#head = this.#head!.next
    this.#head!.prev = null
    removedNode.cleanup()
    this.#length--
    return removedValue
  }

  public popBack(): T | undefined {
    // No Node
    if (this.isEmpty()) return

    const removedNode = this.#tail!
    const removedValue = removedNode.val

    // Single node case
    if (this.#length === 1) {
      this.#head = this.#tail = null
      removedNode.cleanup()
      this.#length--
      return removedValue
    }

    // Two or more case
    const prevNode = this.#tail!.prev!
    prevNode.next = null
    this.#tail = prevNode
    removedNode.cleanup()
    this.#length--
    return removedValue
  }

  public isEmpty(): boolean {
    return this.#length === 0
  }

  public clear(): void {
    if (this.isEmpty()) return
    let current = this.#head
    while (current != null) {
      const nextNode = current.next
      current.cleanup()
      current = nextNode
    }
    this.#head = this.#tail = null
    this.#length = 0
  }

  public emplaceFront(...args: A): void {
    if (typeof this.#factory === 'function') {
      this.pushFront(this.#factory(...args))
      return
    }
    this.pushFront(args[0] as T)
  }

  public emplaceBack(...args: A): void {
    if (typeof this.#factory === 'function') {
      this.pushBack(this.#factory(...args))
      return
    }
    this.pushBack(args[0] as T)
  }

  // Static method
  public static swap<U, V extends unknown[] = [U]>(
    queue1: Deque<U, V>,
    queue2: Deque<U, V>,
  ): void {
    if (!(queue1 instanceof Deque && queue2 instanceof Deque)) {
      throw new TypeError('Both arguments must be instances of Deque')
    }
    const tempHead = queue1.#head
    const tempTail = queue1.#tail
    const tempLength = queue1.#length

    queue1.#head = queue2.#head
    queue1.#tail = queue2.#tail
    queue1.#length = queue2.#length

    queue2.#head = tempHead
    queue2.#tail = tempTail
    queue2.#length = tempLength
  }

  // Getter & Setter
  public get length(): number {
    return this.#length
  }

  public get front(): T | undefined {
    if (this.isEmpty()) return
    return this.#head!.val
  }

  public set front(val: T) {
    if (this.isEmpty()) return
    this.#head!.val = val
  }

  public get back(): T | undefined {
    if (this.isEmpty()) return
    return this.#tail!.val
  }

  public set back(val: T) {
    if (this.isEmpty()) return
    this.#tail!.val = val
  }

  public at(index: number): T | undefined {
    if (this.isEmpty() || index < 0 || index >= this.#length) return
    let current = this.#head
    let i = 0
    while (current !== null) {
      if (index === i) return current.val
      current = current.next
      i++
    }
    return
  }

  public toArray(): T[] {
    return [...this]
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

  public forEach(
    callback: (value: T, index: number, deque: Deque<T, A>) => void | false,
    thisArg?: unknown,
  ): void {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function')
    }
    let current = this.#head
    let index = 0
    while (current !== null) {
      const res = callback.call(thisArg, current.val, index, this)
      if (res === false) break
      current = current.next
      index++
    }
  }
}
