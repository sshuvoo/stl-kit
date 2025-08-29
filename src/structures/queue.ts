import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface QueueOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

/**
 * Queue — a simple FIFO (first-in, first-out) queue backed by a
 * doubly-linked list (`ListNode`).
 *
 * This class provides both JavaScript-friendly and STL-like ergonomics:
 * - `front` (getter) returns the head value or `undefined` when empty
 *   (non-throwing, JS style).
 * - `peek()` throws an `Error` when the queue is empty (defensive,
 *   explicit-failure behaviour preferred by some STL users).
 *
 * Similarly, `length` (getter) and `size()` both return the same count;
 * `length` is a natural JS property while `size()` mirrors STL naming.
 *
 * Type parameters:
 * - T: element type stored in the queue
 * - A: tuple type for the optional `factory` arguments used by `emplace`
 *
 * Implementation notes:
 * - Uses private `#head`, `#tail`, and `#length` fields.
 * - `push`/`pop` are O(1). Iteration and conversion helpers are O(n).
 */
export class Queue<T, A extends unknown[] = unknown[]> implements Iterable<T> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>

  /**
   * Create a new `Queue`.
   *
   * @param options.initValues - Optional initial array of values to push
   *   into the queue in order (front -> back). If present and not an
   *   array, a `TypeError` is thrown.
   * @param options.factory - Optional factory function used by
   *   `emplace(...args)` to construct elements in-place.
   *
   * Complexity: O(n) when `initValues` is provided (push each element),
   * otherwise O(1).
   */
  constructor({ initValues, factory }: QueueOptions<T, A> = {}) {
    this.#head = this.#tail = null
    this.#length = 0
    this.#factory = factory
    if (initValues !== undefined && !Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the queue.')
    }
    if (initValues !== undefined) {
      for (const value of initValues) {
        this.push(value)
      }
    }
  }

  /**
   * Iterate values from front (head) to back (tail).
   *
   * Yields items in queue order (not a snapshot; use `toArray()` to
   * obtain a separate array). The iterator is safe to use with for..of
   * and spread.
   *
   * Complexity: O(n) to iterate all elements.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    let current = this.#head
    while (current !== null) {
      yield current.val
      current = current.next
    }
  }

  /**
   * Return an iterator that yields values from back (tail) to front
   * (head). Useful when you need reverse-order traversal.
   *
   * Example: `for (const v of queue.reversed) { ... }` or
   * `const arr = [...queue.reversed]`.
   */
  get reversed(): IterableIterator<T> {
    function* iterator(this: Queue<T, A>): IterableIterator<T> {
      let current = this.#tail
      while (current !== null) {
        yield current.val
        current = current.prev
      }
    }
    return iterator.call(this)
  }

  /**
   * Push a value at the back (tail) of the queue.
   *
   * Complexity: O(1)
   *
   * @param value - Element to append to the queue.
   */
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

  /**
   * Remove and return the value at the front (head) of the queue.
   *
   * Complexity: O(1)
   *
   * @returns The removed element.
   * @throws Error when the queue is empty.
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new Error('Cannot perform pop operation on empty queue.')
    }

    const peek = this.#head!
    const peekVal = peek.val

    // Single Node
    if (this.#length === 1) {
      this.#head = this.#tail = null
      peek.cleanup()
      this.#length--
      return peekVal
    }

    // Two and more nodes
    this.#head = this.#head!.next
    this.#head!.prev = null
    peek.cleanup()
    this.#length--
    return peekVal
  }

  /**
   * Construct an element using the constructor `factory` (provided at
   * Queue creation) and push it into the queue.
   *
   * Complexity: O(1) plus the cost of the factory.
   *
   * @throws TypeError if no `factory` was provided in the constructor.
   */
  public emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new TypeError('Factory function is not defined to perform emplace.')
    }
    this.push(this.#factory(...args))
  }

  /**
   * Check whether the queue contains no elements.
   *
   * @returns `true` when empty, otherwise `false`.
   */
  public isEmpty(): boolean {
    return this.#length === 0
  }

  /**
   * Remove all elements from the queue and free node resources.
   *
   * Complexity: O(n) to traverse and cleanup nodes.
   */
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

  /**
   * Return a shallow array copy of the queue values in front->back
   * order.
   *
   * Complexity: O(n)
   */
  public toArray(): T[] {
    return [...this]
  }

  // Overload signatures
  public assign(count: number, value: T): void
  public assign(values: T[], start?: number, end?: number): void

  // Implementation
  /**
   * Assign overload implementation.
   *
   * Overloads:
   * - `assign(values: T[], start?: number, end?: number)` — copy a slice
   *   of `values` into the queue (clears first).
   * - `assign(count: number, value: T)` — clear and fill `count`
   *   repeated `value` elements.
   *
   * Complexity: O(n)
   */
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

  /**
   * Iterate over each element and call `callback(value, index, queue)`.
   * If the callback returns `false`, iteration is stopped early.
   *
   * @param callback - Function invoked for each element. Returning
   *   `false` stops iteration.
   * @param thisArg - Optional `this` binding for the callback.
   * @throws TypeError when `callback` is not a function.
   */
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

  /**
   * Return (but do not remove) the element at the front (head).
   *
   * This method throws an `Error` when the queue is empty — prefer the
   * non-throwing `front` getter if you want `undefined` instead.
   *
   * Complexity: O(1)
   *
   * @returns The head value.
   * @throws Error when the queue is empty.
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new Error('Cannot perform peek operation on empty queue.')
    }
    return this.#head!.val
  }

  /**
   * Create a shallow/deep copy of the queue.
   *
   * By default this tries to use `structuredClone` for deep copying
   * elements; if `structuredClone` is not available you can provide a
   * `deepCloneFn`.
   *
   * Complexity: O(n)
   *
   * @param deepCloneFn - Optional function to deep clone stored values.
   * @returns A new `Queue` instance with cloned elements.
   */
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

  /**
   * Return the number of elements in the queue (STL-style).
   *
   * @returns Non-negative integer count.
   */
  public size(): number {
    return this.#length
  }

  // Getter and Setter
  /**
   * `length` getter (JS-style alias for `size()`).
   *
   * @returns The number of elements in the queue.
   */
  public get length(): number {
    return this.#length
  }

  /**
   * Non-throwing accessor for the front value.
   *
   * Returns the head value or `undefined` when the queue is empty.
   * This is convenient when you prefer a safe, non-exception style of
   * access (JavaScript idiom).
   *
   * Use `peek()` when you prefer an explicit error on empty queues.
   */
  public get front(): T | undefined {
    if (this.isEmpty()) return
    return this.#head!.val
  }

  // Static method
  /**
   * Compare two queues for element-wise equality.
   *
   * @param queue1 - First queue instance.
   * @param queue2 - Second queue instance.
   * @param comparator - Optional comparator used to test values. Defaults
   *   to strict equality (`===`).
   * @returns `true` when both queues are equal in length and their
   *   elements compare equal in order.
   * @throws TypeError when inputs are not `Queue` instances.
   */
  public static equals<U, V extends unknown[] = unknown[]>(
    queue1: Queue<U, V>,
    queue2: Queue<U, V>,
    comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ): boolean {
    if (!(queue1 instanceof Queue && queue2 instanceof Queue)) {
      throw new TypeError('Input value must be an instance of queue')
    }

    if (
      queue1.#factory !== queue2.#factory ||
      queue1.#length !== queue2.#length
    ) {
      return false
    }

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

  /**
   * Swap the internal state of two queues in O(1) time.
   *
   * This exchanges `#head`, `#tail`, and `#length` between two queues.
   * Both queues must have the same `factory` function (or both undefined).
   *
   * @throws TypeError when inputs are not `Queue` instances or their
   *   factories differ.
   */
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
