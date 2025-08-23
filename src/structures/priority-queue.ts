type CompareFn<T> = (a: T, b: T) => number

type Factory<T, A extends unknown[]> = (...args: A) => T

interface PQueueOptions<T, A extends unknown[]> {
  initValues?: T[]
  compareFn?: CompareFn<T>
  factory?: Factory<T, A>
}

/**
 * PriorityQueue — a binary-heap backed priority queue.
 *
 * This implementation uses a binary heap stored in a flat array. By default
 * it behaves as a max-heap for numbers (largest number has highest priority).
 * Provide a custom `compareFn` to change ordering (for example, to implement
 * a min-heap or to prioritize complex objects).
 *
 * Type parameters:
 * - T: the element type stored in the queue.
 * - A: tuple type for the factory function arguments used by `emplace`.
 *
 * Comparator contract (`compareFn(a, b)`):
 * - return > 0 when `a` has higher priority than `b` (a should come before b)
 * - return < 0 when `a` has lower priority than `b`
 * - return 0 when `a` and `b` are considered equal
 *
 * Notes for beginners:
 * - The internal array order is the heap order, not a sorted order. Use
 *   `toArray()` to get a shallow copy of the heap array, or repeatedly call
 *   `pop()` to extract elements in priority order.
 */
export class PriorityQueue<T, A extends unknown[] = unknown[]> {
  #heap: T[]
  #compareFn: CompareFn<T>
  #factory?: Factory<T, A>

  /**
   * Create a new PriorityQueue.
   *
   * @param options.initValues - Optional initial array of values to heapify.
   *   If provided, the array will be used as the internal heap storage and
   *   heapified in-place. The array order does not need to be a heap;
   *   it will be transformed into a valid heap during construction.
   * @param options.compareFn - Optional comparator function which defines
   *   the priority ordering. It should return a positive number when the
   *   first argument has higher priority than the second. If omitted, a
   *   default numeric comparator is used (max-heap behaviour) and will throw
   *   if non-number items are inserted.
   * @param options.factory - Optional factory function used by `emplace` to
   *   create elements in-place from argument list `A`.
   *
   * Throws:
   * - TypeError if `initValues` is provided but is not an array.
   */
  constructor({ initValues, compareFn, factory }: PQueueOptions<T, A> = {}) {
    if (typeof compareFn == 'function') {
      this.#compareFn = compareFn
    } else {
      this.#compareFn = (a, b) => {
        if (typeof a == 'number' && typeof b == 'number') {
          return a - b
        }
        throw new TypeError(
          'PriorityQueue: no compareFn provided — default comparator only supports numbers',
        )
      }
    }

    this.#factory = factory

    if (initValues !== undefined && !Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the PriorityQueue.')
    }

    this.#heap = initValues ?? []
    const len = this.#heap.length
    if (len > 1) {
      for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        this.#heapifyDown(i)
      }
    }
  }

  // cIdx ~ current index
  #heapifyDown(cIdx: number): void {
    const nodes = this.#heap
    const len = nodes.length
    while (true) {
      const lIdx = 2 * cIdx + 1 // left child index
      const rIdx = 2 * cIdx + 2 // right child
      let best = cIdx

      if (lIdx < len && this.#compareFn(nodes[best]!, nodes[lIdx]!) < 0) {
        best = lIdx
      }

      if (rIdx < len && this.#compareFn(nodes[best]!, nodes[rIdx]!) < 0) {
        best = rIdx
      }

      if (best == cIdx) break
      this.#swap(best, cIdx)
      cIdx = best
    }
  }

  #heapifyUp(cIdx: number): void {
    while (cIdx > 0) {
      const pIdx = Math.floor((cIdx + 1) / 2) - 1 // parent index
      if (this.#compareFn(this.#heap[cIdx]!, this.#heap[pIdx]!) <= 0) break
      this.#swap(pIdx, cIdx)
      cIdx = pIdx
    }
  }

  /**
   * Iterator that yields elements in the underlying heap array order.
   *
   * The iteration order is the heap layout, not priority-sorted order.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    for (const val of this.#heap) {
      yield val
    }
  }

  /**
   * Insert a new element into the priority queue.
   *
   * Complexity: O(log n) where n is the number of elements in the queue.
   *
   * @param node - The element to insert.
   */
  push(node: T): void {
    let cIdx = this.#heap.push(node) - 1 //current index
    this.#heapifyUp(cIdx)
  }

  /**
   * Construct a new element using the provided factory and insert it into
   * the queue.
   *
   * This is useful when constructing elements is expensive and you want to
   * avoid creating the element if it won't be inserted. The factory receives
   * the provided arguments and must return an instance of `T`.
   *
   * Complexity: O(log n).
   *
   * @param args - Arguments forwarded to the factory function.
   * @throws Error if the queue was not constructed with a `factory`.
   */
  emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error(
        'PriorityQueue was not initialized with a factory function',
      )
    }
    this.push(this.#factory(...args))
  }

  /**
   * Replace the element at the top of the heap (the current highest-priority
   * element) with `node` and restore the heap property.
   *
   * This operation is slightly more efficient than `pop()` followed by
   * `push()` because it performs a single down-heap operation.
   *
   * Complexity: O(log n).
   *
   * @param node - The element to place at the root of the heap.
   * @returns The previous root element (the replaced element).
   * @throws Error if the heap is empty.
   */
  replace(node: T): T {
    if (this.isEmpty()) {
      throw new Error('Heap is empty, cannot replace peek node.')
    }
    const peek = this.#heap[0]!
    this.#heap[0] = node
    this.#heapifyDown(0)
    return peek
  }

  /**
   * Remove and return the highest-priority element from the queue.
   *
   * Complexity: O(log n).
   *
   * @returns The removed element.
   * @throws Error if the heap is empty.
   */
  pop(): T {
    if (this.isEmpty()) {
      throw new Error('Heap is empty, cannot pop element.')
    }
    const len = this.#heap.length
    if (len == 1) return this.#heap.pop()!

    const peek = this.#heap[0]! // removed node
    this.#heap[0] = this.#heap.pop()!

    this.#heapifyDown(0)
    return peek
  }

  /**
   * Return (but do not remove) the highest-priority element.
   *
   * @returns The element at the root of the heap, or `undefined` if the
   *   queue is empty.
   */
  peek(): T | undefined {
    return this.#heap[0]
  }

  /**
   * Check whether the queue contains no elements.
   *
   * @returns `true` when empty, otherwise `false`.
   */
  isEmpty(): boolean {
    return this.#heap.length === 0
  }

  /**
   * Remove all elements from the queue.
   *
   * This resets the internal storage to an empty array in-place.
   */
  clear(): void {
    this.#heap.length = 0
  }

  /**
   * Return the number of elements currently stored in the queue.(STL style)
   *
   * @returns The size of the queue (non-negative integer).
   */
  size(): number {
    return this.#heap.length
  }

  /**
   * Return the number of elements currently stored in the queue.(JS style)
   *
   * @returns The length of the queue (non-negative integer).
   */
  get length(): number {
    return this.#heap.length
  }

  /**
   * Return a shallow copy of the internal heap array.
   *
   * Important: the returned array represents the heap structure and is not
   * guaranteed to be sorted. Use repeated `pop()` calls to obtain elements in
   * priority order.
   *
   * @returns A new array containing the queue elements in heap order.
   */
  toArray(): T[] {
    return [...this.#heap]
  }

  #swap(i: number, j: number): void {
    const temp = this.#heap[i]!
    this.#heap[i] = this.#heap[j]!
    this.#heap[j] = temp
  }
}
