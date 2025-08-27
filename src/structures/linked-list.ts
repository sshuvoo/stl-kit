import { ListNode } from '@/core/list-node'

type Factory<T, A extends unknown[]> = (...args: A) => T

interface ListOptions<T, A extends unknown[]> {
  initValues?: T[]
  factory?: Factory<T, A>
}

/**
 * Doubly-linked list implementation.
 *
 * This LinkedList stores nodes in a doubly-linked chain and provides
 * efficient O(1) insertion/removal at both ends and O(n) indexed
 * operations. It is a general-purpose container suitable for situations
 * where frequent splices, head/tail operations or stable references to
 * elements are required.
 *
 * Type parameters:
 * - T: element type stored in the list
 * - A: tuple type for an optional factory function used by `emplace*`
 *
 * Notes for beginners:
 * - Many methods throw on invalid usage (for example, popping from an
 *   empty list or using an out-of-range index). Use `isEmpty()` and
 *   `size()`/`length` to check state before mutating.
 */
export class LinkedList<T, A extends unknown[] = unknown[]> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  #length: number
  #factory?: Factory<T, A>
  /**
   * Create a new LinkedList.
   *
   * @param options.initValues - Optional array of initial values to append
   *   to the list. Values are pushed to the back in the given order.
   * @param options.factory - Optional factory function used by the
   *   `emplace*` methods to create values from arguments `A`.
   *
   * Throws:
   * - TypeError if `initValues` is provided but is not an array.
   */
  constructor({ initValues, factory }: ListOptions<T, A> = {}) {
    this.#head = this.#tail = null
    this.#length = 0
    this.#factory = factory

    if (initValues !== undefined && !Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the list.')
    }
    if (initValues != undefined) {
      for (const value of initValues) {
        this.pushBack(value)
      }
    }
  }

  // Iterable
  /**
   * Iterate over values from front to back.
   *
   * The iterator yields elements in list order (head -> tail). This does
   * not clone the list; mutating the list during iteration may produce
   * unexpected results.
   */
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

  /**
   * Insert `value` at the front (head) of the list.
   *
   * Complexity: O(1).
   *
   * @param value - value to insert.
   */
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

  /**
   * Insert `value` at the back (tail) of the list.
   *
   * Complexity: O(1).
   *
   * @param value - value to insert.
   */
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

  /**
   * Remove and return the value at the front of the list.
   *
   * Complexity: O(1).
   *
   * @returns the removed value.
   * @throws Error when the list is empty.
   */
  public popFront(): T {
    // No node
    if (this.isEmpty()) {
      throw new Error('popFront: Cannot pop from an empty linked list')
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
    this.#head = this.#head!.next!
    this.#head.prev = null
    peek.cleanup()
    this.#length--
    return peekVal
  }

  /**
   * Remove and return the value at the back of the list.
   *
   * Complexity: O(1).
   *
   * @returns the removed value.
   * @throws Error when the list is empty.
   */
  public popBack(): T {
    // No Node
    if (this.isEmpty()) {
      throw new Error('popBack: Cannot pop from an empty linked list')
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
   * Insert `val` at position `index` (0-based). Inserting at index 0
   * prepends, inserting at `size()` appends.
   *
   * Complexity: O(n) in the worst case (traversal).
   *
   * @param val - value to insert
   * @param index - zero-based index where to insert
   * @throws RangeError when index is out of range
   */
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

  /**
   * Remove and return the element at `index`.
   *
   * Complexity: O(n) (traversal) unless removing from head/tail.
   *
   * @param index - zero-based index of the element to remove
   * @returns removed element
   * @throws Error when the list is empty
   * @throws RangeError when index is out of bounds
   */
  public eraseAt(index: number): T {
    if (this.isEmpty()) {
      throw new Error('eraseAt: Cannot erase from an empty linked list')
    }

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

  /**
   * Construct a new element using the provided factory and insert it at
   * the front of the list.
   *
   * Use this when creating the value requires multiple arguments or is
   * expensive and you want the list to own the construction step.
   *
   * @param args - arguments forwarded to the factory function
   * @throws Error if no factory was provided at construction
   */
  public emplaceFront(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error('emplaceFront: Factory function is not defined')
    }
    this.pushFront(this.#factory(...args))
  }

  /**
   * Construct a new element using the provided factory and insert it at
   * the back of the list.
   *
   * @param args - arguments forwarded to the factory function
   * @throws Error if no factory was provided at construction
   */
  public emplaceBack(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error('emplaceBack: Factory function is not defined')
    }
    this.pushBack(this.#factory(...args))
  }

  /**
   * Construct a new element using the provided factory and insert it at
   * `index`.
   *
   * @param index - position to insert
   * @param args - arguments forwarded to the factory
   * @throws Error if no factory was provided at construction
   */
  public emplaceAt(index: number, ...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error('emplaceAt: Factory function is not defined')
    }
    this.insertAt(this.#factory(...args), index)
  }

  /**
   * Check whether the list is empty.
   *
   * @returns `true` when empty, otherwise `false`.
   */
  public isEmpty(): boolean {
    return this.#length === 0
  }

  /**
   * Return the number of elements in the list.
   *
   * @returns non-negative integer size of the list.
   */
  public size(): number {
    return this.#length
  }

  /**
   * Remove all elements from the list.
   *
   * This performs an in-place cleanup of nodes and resets internal
   * bookkeeping.
   */
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

  /**
   * Return a shallow array copy of the list values in order.
   *
   * @returns new array with the list values (head -> tail)
   */
  public toArray(): T[] {
    return [...this]
  }

  // Overload signatures
  public assign(count: number, value: T): void
  public assign(values: T[], start?: number, end?: number): void

  // Implementation
  /**
   * Assign new contents to the list.
   *
   * Overloads:
   * - `assign(values: T[], start?, end?)` — copy a slice of an array
   * - `assign(count: number, value: T)` — fill the list with `count` copies
   *
   * This method clears the list then populates it according to the chosen
   * overload.
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

  /**
   * Iterate the list and call `callback` for every element. If callback
   * returns `false` iteration stops early.
   *
   * @param callback - function called with `(value, index, list)`
   * @param thisArg - optional `this` binding for the callback
   */
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

  /**
   * Reverse the list in-place.
   *
   * Complexity: O(n). Safe for empty and single-element lists.
   */
  public reverse(): void {
    if (this.length <= 1) return

    let prev: ListNode<T> | null = null
    let curr: ListNode<T> | null = this.#head

    while (curr != null) {
      const next = curr.next

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

  /**
   * Remove all elements that match `val` according to `compareFn`.
   *
   * @param val - value to match
   * @param compareFn - equality comparison (default strict equality)
   * @returns number of removed elements
   */
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

  // Setter & Getter method
  public get length(): number {
    return this.#length
  }

  public get front(): T {
    if (this.isEmpty()) {
      throw new Error(
        'front: cannot access front element of an empty linked list',
      )
    }
    return this.#head!.val
  }

  public set front(val: T) {
    if (this.isEmpty()) {
      throw new Error('front: cannot set front element of an empty linked list')
    }
    this.#head!.val = val
  }

  public get back(): T {
    if (this.isEmpty()) {
      throw new Error(
        'back: cannot access back element of an empty linked list',
      )
    }
    return this.#tail!.val
  }

  public set back(val: T) {
    if (this.isEmpty()) {
      throw new Error('back: cannot set back element of an empty linked list')
    }
    this.#tail!.val = val
  }

  // Static method
  public static swap<U, V extends unknown[] = [U]>(
    list1: LinkedList<U, V> | null,
    list2: LinkedList<U, V> | null,
  ): void {
    /**
     * Swap the contents of two linked lists in O(1) by swapping internal
     * pointers and lengths.
     *
     * @throws TypeError when either argument is not a `LinkedList`.
     */
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
    /**
     * Merge `source` into `target`. Both lists must be sorted according to
     * `compareFn`. After the operation `source` will be empty and `target`
     * will contain the merged sorted sequence.
     *
     * This operates in-place by relinking nodes and performs O(n) work.
     *
     * @throws TypeError when inputs are not `LinkedList` instances or
     *   `compareFn` is not a function.
     * @throws Error when attempting to merge a list with itself.
     */
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
    /**
     * Build a pair of head/tail nodes from an array of values. This helper
     * is useful when constructing lists from pre-existing arrays.
     *
     * @param values - array of values to convert into a linked node chain
     * @returns an object containing `head` and `tail` nodes (or nulls for
     *   an empty input)
     * @throws TypeError when `values` is not an array
     */
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
