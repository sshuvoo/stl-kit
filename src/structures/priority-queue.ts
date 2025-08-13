import { Heap } from './heap'

type PQValue<T> = T extends number ? number : PriorityNode<T>

type CompareFn<T> = (a: PQValue<T>, b: PQValue<T>) => number

type Factory<T, A extends unknown[]> = (...args: A) => T

interface PriorityNode<T> {
  priority: number
  value: T
}

interface PQueueOptions<T, A extends unknown[]> {
  initValues?: PQValue<T>[]
  compareFn?: CompareFn<T>
  factory?: Factory<PQValue<T>, A>
}

/**
 * PriorityQueue is a min/max priority queue based on a binary heap.
 * If T is number, the queue stores numbers directly; otherwise, it stores PriorityNode<T>.
 * Methods mirror those of Heap.
 * @template T The value type
 * @template A The argument types for the factory function
 */
export class PriorityQueue<T, A extends unknown[] = unknown[]> {
  #heap: Heap<PQValue<T>, A>

  /**
   * Create a new PriorityQueue.
   * @param {PQueueOptions<T, A>} options - Initialization options
   */
  constructor({ initValues, compareFn, factory }: PQueueOptions<T, A> = {}) {
    this.#heap = new Heap({
      initValues,
      factory,
      compareFn: compareFn,
    })
  }

  /**
   * Insert a new value into the priority queue.
   * @param {PQValue<T>} node - The value to insert
   */
  push(node: PQValue<T>): void {
    this.#heap.push(node)
  }

  /**
   * Insert a new value using the factory function and arguments.
   * @param {...A} args - Arguments for the factory function
   */
  emplace(...args: A): void {
    this.#heap.emplace(...args)
  }

  /**
   * Replace the top value with a new one and return the old top value.
   * @param {PQValue<T>} node - The new value
   * @returns {PQValue<T>} The old top value
   */
  replace(node: PQValue<T>): PQValue<T> {
    return this.#heap.replace(node)
  }

  /**
   * Remove and return the top value from the queue.
   * @returns {PQValue<T>} The removed top value
   */
  pop(): PQValue<T> {
    return this.#heap.pop()
  }

  /**
   * Get the top value without removing it.
   * @returns {PQValue<T>|undefined} The top value or undefined if empty
   */
  peek(): PQValue<T> | undefined {
    return this.#heap.peek()
  }

  /**
   * Check if the queue is empty.
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty(): boolean {
    return this.#heap.isEmpty()
  }

  /**
   * Remove all values from the queue.
   */
  clear(): void {
    this.#heap.clear()
  }

  /**
   * Get the number of values in the queue.
   * @returns {number} The size of the queue
   */
  size(): number {
    return this.#heap.size()
  }
}
