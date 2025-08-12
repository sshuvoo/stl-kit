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
  *[Symbol.iterator](): IterableIterator<T> {
    for (const val of this.#nodes) {
      yield val
    }
  }

  push(node: T): void {
    let cIdx = this.#nodes.push(node) - 1 //current index
    this.#heapifyUp(cIdx)
  }

  emplace(...args: A): void {
    if (typeof this.#factory !== 'function') {
      throw new Error('Heap was not initialized with a factory function')
    }
    this.push(this.#factory(...args))
  }

  replace(node: T): T {
    if (this.isEmpty()) {
      throw new Error('Heap is empty, cannot replace root node.')
    }
    const root = this.#nodes[0]!
    this.#nodes[0] = node
    this.#heapifyDown(0)
    return root
  }

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

  peek(): T | undefined {
    return this.#nodes[0]
  }

  isEmpty(): boolean {
    return this.#nodes.length === 0
  }

  clear(): void {
    this.#nodes.length = 0
  }

  size(): number {
    return this.#nodes.length
  }

  toArray(): T[] {
    return [...this.#nodes]
  }

  #swap(i: number, j: number): void {
    const temp = this.#nodes[i]!
    this.#nodes[i] = this.#nodes[j]!
    this.#nodes[j] = temp
  }
}
