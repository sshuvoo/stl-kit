import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface StackOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

/**
 * Stack — a classic LIFO (last-in, first-out) stack backed by a
 * doubly-linked list (`ListNode`).
 *
 * This class provides both JS-friendly and STL-like ergonomics:
 * - `top` (getter) returns the top value or `undefined` when empty (non-throwing)
 * - `peek()` throws an `Error` when the stack is empty (defensive, explicit-failure)
 *
 * `length` (getter) and `size()` both return the same count; `length` is
 * the JS-friendly property, while `size()` mirrors STL naming.
 *
 * Type parameters:
 * - T: value type stored in the stack
 * - A: tuple type for optional `factory` arguments used by `emplace`
 *
 * Performance:
 * - `push` / `pop` are O(1). Iteration and conversion helpers are O(n).
 */
export class Stack<T, A extends unknown[] = unknown[]> implements Iterable<T> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>
  /**
   * Create a new `Stack`.
   *
   * @param options.initValues - Optional initial array of values; each
   *   value will be pushed in order (first item becomes lowest in stack).
   * @param options.factory - Optional factory function used by
   *   `emplace(...args)` to construct values in-place.
   *
   * Complexity: O(n) when `initValues` is present (push each element),
   * otherwise O(1).
   */
  constructor({ initValues, factory }: StackOptions<T, A> = {}) {
    this.#head = this.#tail = null
    this.#length = 0
    this.#factory = factory
    if (initValues !== undefined && !Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the stack.')
    }
    if (initValues !== undefined) {
      for (const value of initValues) {
        this.push(value)
      }
    }
  }

  /**
   * Iterate values from bottom (head) to top (tail).
   *
   * Yields items in stack order from head -> tail. Use `toArray()` for a
   * snapshot copy. Works with `for..of` and spread.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    let current = this.#head
    while (current !== null) {
      yield current.val
      current = current.next
    }
  }

  /**
   * Return an iterator that yields values from top (tail) to bottom
   * (head). Useful for reverse traversal of the stack.
   */
  get reversed(): IterableIterator<T> {
    function* iterator(this: Stack<T, A>): IterableIterator<T> {
      let current = this.#tail
      while (current !== null) {
        yield current.val
        current = current.prev
      }
    }
    return iterator.call(this)
  }

  /**
   * Push a value onto the top of the stack.
   *
   * Complexity: O(1)
   * @param value - Element to push.
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
   * Pop and return the top value from the stack.
   *
   * Complexity: O(1)
   * @returns The popped element.
   * @throws Error when the stack is empty.
   */
  public pop(): T {
    if (this.isEmpty()) {
      throw new Error('Cannot perform pop operation on empty stack.')
    }

    const peek = this.#tail!
    const peekVal = peek.val

    // Single node case
    if (this.#length === 1) {
      this.#head = this.#tail = null
      peek.cleanup()
      this.#length--
      return peekVal
    }

    // Two or more case
    const prevNode = this.#tail!.prev!
    prevNode.next = null
    this.#tail = prevNode
    peek.cleanup()
    this.#length--
    return peekVal
  }

  /**
   * Construct a value using the `factory` provided at construction and
   * push it onto the stack.
   *
   * Complexity: O(1) plus factory cost.
   * @throws TypeError if no factory was provided.
   */
  public emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new TypeError('Please provide a factory function to use emplace.')
    }
    this.push(this.#factory(...args))
  }

  /**
   * Check whether the stack contains no elements.
   * @returns `true` when empty.
   */
  public isEmpty(): boolean {
    return this.#length === 0
  }

  /**
   * Remove all elements and free node resources.
   * Complexity: O(n).
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
   * Return a shallow array copy of the stack values in head->tail order.
   * Complexity: O(n).
   */
  public toArray(): T[] {
    return [...this]
  }

  // Overload signatures
  public assign(count: number, value: T): void
  public assign(values: T[], start?: number, end?: number): void

  /**
   * Assign overload implementation.
   * - `assign(values: T[], start?, end?)` copies a slice of an array into
   *   the stack (clears first).
   * - `assign(count: number, value: T)` fills the stack with `count`
   *   repeated `value` elements.
   * Complexity: O(n).
   */
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

  /**
   * Call `callback(value, index, stack)` for each element from head -> tail.
   * If the callback returns `false`, iteration stops early.
   * @throws TypeError when `callback` is not a function.
   */
  public forEach(
    callback: (value: T, index: number, stack: Stack<T, A>) => void | false,
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
   * Return (but do not remove) the top value.
   * @returns The top value.
   * @throws Error when the stack is empty.
   */
  public peek(): T {
    if (this.isEmpty()) {
      throw new Error('Cannot perform peek operation on empty stack.')
    }
    return this.#tail!.val
  }

  /**
   * Create a shallow/deep copy of the stack.
   * By default attempts to use `structuredClone`. Otherwise provide
   * a `deepCloneFn`.
   * Complexity: O(n)
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
  ): Stack<T, A> {
    if (typeof deepCloneFn !== 'function') {
      throw new TypeError('deepCloneFn must be a function')
    }
    const copy = new Stack<T, A>({ factory: this.#factory })
    for (const val of this) {
      copy.push(deepCloneFn(val))
    }
    return copy
  }

  /**
   * Return the number of elements in the stack (STL-style).
   * @returns Non-negative integer count.
   */
  public size(): number {
    return this.#length
  }

  // Getter and Setter
  /**
   * `length` getter (JS-style alias for `size()`).
   */
  public get length(): number {
    return this.#length
  }

  /**
   * Non-throwing accessor for the top value. Returns `undefined` when
   * the stack is empty.
   */
  public get top(): T | undefined {
    if (this.isEmpty()) return
    return this.#tail!.val
  }

  // Static method
  /**
   * Compare two stacks for element-wise equality.
   * @param stack1 - First stack instance.
   * @param stack2 - Second stack instance.
   * @param comparator - Optional comparator function (defaults to ===).
   * @returns `true` when both stacks have same length and elements compare equal in order.
   * @throws TypeError when inputs are not `Stack` instances.
   */
  public static equals<U, V extends unknown[] = unknown[]>(
    stack1: Stack<U, V>,
    stack2: Stack<U, V>,
    comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ): boolean {
    if (!(stack1 instanceof Stack && stack2 instanceof Stack)) {
      throw new TypeError('Input value must be an instance of stack')
    }

    if (stack1.#factory !== stack2.#factory) {
      return false
    }

    if (stack1.#length !== stack2.#length) return false
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
    return backtrack(stack1.#head, stack2.#head)
  }

  /**
   * Swap internal state of two stacks in O(1) time. Both stacks must have
   * the same `factory` function (or both undefined) to be swappable.
   * @throws TypeError when inputs are not `Stack` instances or factories differ.
   */
  public static swap<U, V extends unknown[] = unknown[]>(
    stack1: Stack<U, V>,
    stack2: Stack<U, V>,
  ): void {
    if (!(stack1 instanceof Stack && stack2 instanceof Stack)) {
      throw new TypeError('Input value must be an instance of stack')
    }

    if (stack1.#factory !== stack2.#factory) {
      throw new TypeError('Both stacks must have the same factory function')
    }

    const tempHead = stack1.#head
    const tempTail = stack1.#tail
    const tempLength = stack1.#length

    stack1.#head = stack2.#head
    stack1.#tail = stack2.#tail
    stack1.#length = stack2.#length

    stack2.#head = tempHead
    stack2.#tail = tempTail
    stack2.#length = tempLength
  }
}
