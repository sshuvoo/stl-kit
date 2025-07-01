import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface ListOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

export class LinkedList<T, A extends unknown[] = [T]> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>
  constructor({ initValues, factory }: ListOptions<T, A> = {}) {
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

  // Private method
  #initializeFrom(initValues?: T[]): void {
    if (initValues === undefined) return

    if (!Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the list.')
    }

    if (initValues.length === 0) return

    for (const value of initValues) {
      this.pushBack(value)
    }
  }

  #unlink(node: ListNode<T>): T {
    const { prev, next, cleanup, val } = node

    if (prev !== null) prev.next = next
    else this.#head = next

    if (next !== null) next.prev = prev
    else this.#tail = prev

    cleanup()
    this.#length--
    return val
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
    this.#head = this.#head!.next!
    this.#head.prev = null
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

  public insertAt(val: T, index: number): void {
    if (index < 0 || index > this.#length) {
      throw new RangeError('Invalid index to insert')
    }

    if (index === 0) {
      this.pushFront(val)
      return
    }

    if (index === this.#length) {
      this.pushBack(val)
      return
    }

    let curr = this.#head
    let i = 0
    while (i < index - 1 && curr != null) {
      curr = curr.next
      i++
    }

    const newNode = new ListNode(val)
    const nextNode = curr!.next!

    // Insert between curr and nextNode
    newNode.prev = curr
    newNode.next = nextNode
    curr!.next = newNode
    nextNode.prev = newNode
    this.#length++
  }

  public eraseAt(index: number): T | undefined {
    if (this.isEmpty()) return

    if (index < 0 || index >= this.#length) {
      throw new RangeError('Invalid index to erase')
    }

    if (index === 0) return this.popFront()

    if (index === this.#length - 1) return this.popBack()

    let curr = this.#head
    let i = 0

    while (curr != null && i < index) {
      curr = curr.next
      i++
    }

    if (curr === null) throw new Error('Index out of bounds after traversal')

    return this.#unlink(curr)
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

  public emplaceAt(index: number, ...args: A): void {
    if (typeof this.#factory === 'function') {
      this.insertAt(this.#factory(...args), index)
      return
    }
    this.insertAt(args[0] as T, index)
  }

  public isEmpty(): boolean {
    return this.#length === 0
  }

  public clear(): void {
    if (this.isEmpty()) return
    let curr = this.#head
    while (curr != null) {
      const nextNode = curr.next
      curr.cleanup()
      curr = nextNode
    }
    this.#head = this.#tail = null
    this.#length = 0
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
    callback: (value: T, index: number, list: LinkedList<T, A>) => void | false,
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

  public reverse(): void {
    if (this.length <= 1) return

    let prev: ListNode<T> | null = null
    let curr: ListNode<T> | null = this.#head
    let next: ListNode<T> | null = null

    while (curr != null) {
      next = curr.next

      // Swap next and prev pointers
      curr.next = prev
      curr.prev = next

      // Move forward
      prev = curr
      curr = next
    }

    // Swap head and tail
    this.#tail = this.#head
    this.#head = prev
  }

  public remove(
    val: T,
    compareFn: (currValue: T, constValue: T) => boolean = (a, b) => a === b,
  ): number {
    if (this.isEmpty()) return 0

    if (typeof compareFn !== 'function') {
      throw new TypeError('compareFn must be a function')
    }

    let count = 0
    let current = this.#head

    while (current !== null) {
      const nextNode = current.next

      if (compareFn(current.val, val)) {
        const prevNode = current.prev

        if (prevNode !== null && nextNode !== null) {
          prevNode.next = nextNode
          nextNode.prev = prevNode
        } else if (prevNode !== null) {
          prevNode.next = null
          this.#tail = prevNode
        } else if (nextNode !== null) {
          nextNode.prev = null
          this.#head = nextNode
        } else {
          this.#head = this.#tail = null
        }

        current.cleanup()
        count++
      }

      current = nextNode
    }

    this.#length -= count
    return count
  }

  // public unique(compareFn: (a: T, b: T) => boolean = (a, b) => a === b): void {
  //   if (this.#length <= 1) return

  //   let current = this.#head!.next
  //   let currVal = this.#head!.val

  //   while (current !== null) {
  //     const next = current.next
  //     if (compareFn(currVal, current.val)) {
  //       this.#unlink(current)
  //     } else {
  //       currVal = current.val
  //     }
  //     current = next
  //   }
  // }

  // Setter & Getter method
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

  public get back(): T | void {
    if (this.isEmpty()) return
    return this.#tail!.val
  }

  public set back(val: T) {
    if (this.isEmpty()) return
    this.#tail!.val = val
  }

  // Static method
  public static swap<U, V extends unknown[] = [U]>(
    list1: LinkedList<U, V> | null,
    list2: LinkedList<U, V> | null,
  ): void {
    if (!(list1 instanceof LinkedList && list2 instanceof LinkedList)) {
      throw new TypeError('Both arguments must be instances of LinkedList')
    }
    const tempHead = list1.#head
    const tempTail = list1.#tail
    const tempLength = list1.#length

    list1.#head = list2.#head
    list1.#tail = list2.#tail
    list1.#length = list2.#length

    list2.#head = tempHead
    list2.#tail = tempTail
    list2.#length = tempLength
  }

  public static merge<U, V extends unknown[] = [U]>(
    target: LinkedList<U, V> | null,
    source: LinkedList<U, V> | null,
    compareFn: (a: U, b: U) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0),
  ): void {
    if (!(target instanceof LinkedList && source instanceof LinkedList)) {
      throw new TypeError('Both arguments must be instances of LinkedList')
    }

    if (typeof compareFn !== 'function') {
      throw new TypeError('compareFn must be a function')
    }

    if (target === source) {
      throw new Error('Cannot merge a list with itself')
    }

    let targetNode = target.#head
    let sourceNode = source.#head

    while (targetNode !== null && sourceNode !== null) {
      if (compareFn(sourceNode.val, targetNode.val) < 0) {
        const nextSource = sourceNode.next

        // Unlink sourceNode from source
        if (nextSource) nextSource.prev = null
        source.#head = nextSource
        if (!source.#head) source.#tail = null
        source.#length--

        // Insert before targetNode
        const prevTarget = targetNode.prev
        sourceNode.prev = prevTarget
        sourceNode.next = targetNode
        targetNode.prev = sourceNode

        if (prevTarget) {
          prevTarget.next = sourceNode
        } else {
          target.#head = sourceNode
        }

        target.#length++
        sourceNode = nextSource
      } else {
        targetNode = targetNode.next
      }
    }

    // Append remaining source nodes at the end
    if (sourceNode !== null) {
      if (target.#tail) {
        target.#tail.next = sourceNode
        sourceNode.prev = target.#tail
      } else {
        target.#head = sourceNode
      }

      target.#tail = source.#tail
      target.#length += source.#length
      source.#head = source.#tail = null
      source.#length = 0
    }
  }

  public static buildNodes<T>(values: T[]): {
    head: ListNode<T> | null
    tail: ListNode<T> | null
  } {
    if (!Array.isArray(values)) {
      throw new TypeError('Expected an array of values')
    }

    let head: ListNode<T> | null = null
    let tail: ListNode<T> | null = null

    for (const value of values) {
      const newNode = new ListNode(value)
      if (head === null) {
        head = tail = newNode
      } else {
        tail!.next = newNode
        newNode.prev = tail
        tail = newNode
      }
    }

    return { head, tail }
  }
}
