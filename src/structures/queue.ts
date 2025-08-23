import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface QueueOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

export class Queue<T, A extends unknown[] = unknown[]> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>
  constructor({ initValues, factory }: QueueOptions<T, A> = {}) {
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
      throw new TypeError('Expected an array to initialize the stack.')
    }

    if (initValues.length === 0) return

    for (const value of initValues) {
      this.push(value)
    }
  }

  // Public method
  public push(value: T): void {
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

  public pop(): T | undefined {
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

  public emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new TypeError('Please provide a factory function to use emplace.')
    }
    this.push(this.#factory(...args))
  }

  public isEmpty(): boolean {
    return this.#length === 0
  }

  public clear(): void {
    let current = this.#head
    while (current !== null) {
      const next = current.next
      current.cleanup()
      current = next
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
        this.push(values[i]!)
      }
      return
    }

    // Case: assign(count: number, value: T)
    if (typeof arg1 === 'number' && arguments.length === 2) {
      const count = arg1
      const value = arg2 as T

      if (value === undefined) {
        throw new TypeError(
          'Value must be provided when assigning repeated elements.',
        )
      }

      if (count < 0) {
        throw new RangeError('Count must be a non-negative integer')
      }

      this.clear()

      for (let i = 0; i < count; i++) {
        this.push(value)
      }
      return
    }

    // Invalid usage
    throw new TypeError('Invalid arguments passed to assign()')
  }

  public forEach(
    callback: (value: T, index: number, stack: Queue<T, A>) => void | false,
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

  public peek(): T | undefined {
    if (this.isEmpty()) return
    return this.#head!.val
  }

  public clone(
    deepCloneFn: (val: T) => T = (val) => {
      if (typeof structuredClone === 'function') {
        return structuredClone(val)
      }
      throw new Error(
        'structuredClone is not supported in this environment. Please provide a custom deepCloneFn.',
      )
    },
  ): Queue<T, A> {
    if (typeof deepCloneFn !== 'function') {
      throw new TypeError('deepCloneFn must be a function')
    }
    const copy = new Queue<T, A>({ factory: this.#factory })
    for (const val of this) {
      copy.push(deepCloneFn(val))
    }
    return copy
  }

  // Getter and Setter
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

  // Static method
  public static equals<U, V extends unknown[] = unknown[]>(
    queue1: Queue<U, V>,
    queue2: Queue<U, V>,
    comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ): boolean {
    if (!(queue1 instanceof Queue && queue2 instanceof Queue)) {
      throw new TypeError('Input value must be an instance of queue')
    }

    if (queue1.#factory !== queue2.#factory) {
      return false
    }

    if (queue1.#length !== queue2.#length) return false
    function backtrack(
      head1: ListNode<U> | null,
      head2: ListNode<U> | null,
    ): boolean {
      if (head1 === null || head2 === null) {
        return head1 === head2
      }
      if (!comparator(head1.val, head2.val)) return false
      return backtrack(head1.next, head2.next)
    }
    return backtrack(queue1.#head, queue2.#head)
  }

  public static swap<U, V extends unknown[] = unknown[]>(
    queue1: Queue<U, V>,
    queue2: Queue<U, V>,
  ): void {
    if (!(queue1 instanceof Queue && queue2 instanceof Queue)) {
      throw new TypeError('Input value must be an instance of queue')
    }

    if (queue1.#factory !== queue2.#factory) {
      throw new TypeError('Both stacks must have the same factory function')
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
}
