type CompareFn<T> = (a: T, b: T) => number

type Factory<T, A extends unknown[]> = (...args: A) => T

interface HeapOptions<T, A extends unknown[]> {
  initValues?: T[]
  compareFn?: CompareFn<T>
  factory?: Factory<T, A>
}

export class Heap<T, A extends unknown[] = unknown[]> {
  #nodes: T[]
  #compareFn: CompareFn<T>
  #factory?: Factory<T, A>

  /**
   * Creates a new Heap.
   * By default, it's a max heap (biggest item on top).
   * Use `compareFn` for min heap or custom sorting.
   * @param {Object} options - Heap options
   * @param {T[]} [options.initValues] - Items to start with
   * @param {CompareFn<T>} [options.compareFn] - Function to compare items
   * @param {Factory<T, A>} [options.factory] - Function to create items for emplace
   * @example
   * const heap = new Heap({ initValues: [5, 2, 8] })
   */
  constructor({ initValues, compareFn, factory }: HeapOptions<T, A> = {}) {
    if (typeof compareFn == 'function') {
      this.#compareFn = compareFn
    } else {
      this.#compareFn = (a, b) => {
        if (typeof a == 'number' && typeof b == 'number') {
          return a - b
        }
        throw new TypeError(
          'Heap: no compareFn provided — default comparator only supports numbers',
        )
      }
    }

    this.#factory = factory

    if (initValues !== undefined && !Array.isArray(initValues)) {
      throw new TypeError('Expected an array to initialize the heap.')
    }

    this.#nodes = initValues ? [...initValues] : []
    const len = this.#nodes.length
    if (len > 1) {
      for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        this.#heapifyDown(i)
      }
    }
  }

  // cIdx ~ current index
  #heapifyDown(cIdx: number): void {
    const nodes = this.#nodes
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
      if (this.#compareFn(this.#nodes[cIdx]!, this.#nodes[pIdx]!) <= 0) break
      this.#swap(pIdx, cIdx)
      cIdx = pIdx
    }
  }

  // Iterable
  /**
   * Iterate over all items in the heap.
   * @returns {IterableIterator<T>} Iterator for items
   * @example
   * for (const x of heap) { ... }
   */
  *[Symbol.iterator](): IterableIterator<T> {
    for (const val of this.#nodes) {
      yield val
    }
  }

  /**
   * Add a new item to the heap.
   * @param {T} node - The item to add
   * @example
   * heap.push(5)
   */
  push(node: T): void {
    let cIdx = this.#nodes.push(node) - 1 //current index
    this.#heapifyUp(cIdx)
  }

  /**
   * Add a new item using the factory function.
   * Useful for creating complex objects.
   * @param {...A} args - Arguments for the factory function
   * @example
   * heap.emplace('Car', 5)
   */
  emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error('Heap was not initialized with a factory function')
    }
    this.push(this.#factory(...args))
  }

  /**
   * Replace the top item with a new one, and return the old top item.
   * @param {T} node - The new item
   * @returns {T} The old top item
   * @throws {Error} If the heap is empty
   * @example
   * heap.replace(7)
   */
  replace(node: T): T {
    if (this.isEmpty()) {
      throw new Error('Heap is empty, cannot replace root node.')
    }
    const root = this.#nodes[0]!
    this.#nodes[0] = node
    this.#heapifyDown(0)
    return root
  }

  /**
   * Remove and return the top item from the heap.
   * @returns {T} The removed top item
   * @throws {Error} If the heap is empty
   * @example
   * heap.pop()
   */
  pop(): T {
    if (this.isEmpty()) {
      throw new Error('Heap is empty, cannot pop element.')
    }
    const len = this.#nodes.length
    if (len == 1) return this.#nodes.pop()!

    const root = this.#nodes[0]! // removed node
    this.#nodes[0] = this.#nodes.pop()!

    this.#heapifyDown(0)
    return root
  }

  /**
   * See the top item without removing it.
   * @returns {T|undefined} The top item or undefined if empty
   * @example
   * heap.peek()
   */
  peek(): T | undefined {
    return this.#nodes[0]
  }

  /**
   * Check if the heap is empty.
   * @returns {boolean} True if empty, false otherwise
   * @example
   * heap.isEmpty()
   */
  isEmpty(): boolean {
    return this.#nodes.length === 0
  }

  /**
   * Remove all items from the heap.
   * @example
   * heap.clear()
   */
  clear(): void {
    this.#nodes.length = 0
  }

  /**
   * Get the number of items in the heap.
   * @returns {number} The size of the heap
   * @example
   * heap.size()
   */
  size(): number {
    return this.#nodes.length
  }

  /**
   * Get all items as an array (not sorted).
   * @returns {T[]} Array of items
   * @example
   * heap.toArray()
   */
  toArray(): T[] {
    return [...this.#nodes]
  }

  #swap(i: number, j: number): void {
    const temp = this.#nodes[i]!
    this.#nodes[i] = this.#nodes[j]!
    this.#nodes[j] = temp
  }
}
