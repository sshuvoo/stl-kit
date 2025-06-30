import { ListNode } from '@/core/list-node'

type Constructor<T, A extends unknown[] = unknown[]> = new (...args: A) => T

export class Queue<T, A extends unknown[] = unknown[]> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  public length: number
  #TypeCtor?: Constructor<T, A>
  constructor(values?: T[], TypeCtor?: Constructor<T, A>) {
    this.#head = this.#tail = null
    this.length = 0
    this.#TypeCtor = TypeCtor
    this.#initQueue(values)
  }

  // Generator function
  *[Symbol.iterator](): IterableIterator<T> {
    let current = this.#head
    while (current !== null) {
      yield current.val
      current = current.next
    }
  }

  public push(val: T): void {
    const newNode = new ListNode(val)

    // Empty Stack
    if (this.isEmpty()) {
      this.#head = this.#tail = newNode
      this.length++
      return
    }
    // Not Empty
    this.#tail!.next = newNode
    this.#tail = newNode
    this.length++
  }

  public pop(): T | undefined {
    if (this.isEmpty()) return
    this.length--
    const popped = this.#head!
    const val = popped.val
    this.#head = this.#head!.next
    if (this.#head === null) this.#tail = null
    popped.cleanup()
    return val
  }

  public emplace(...arg: A): void {
    if (!this.#TypeCtor) throw new Error('No type class constructor provided')
    const newObj = new this.#TypeCtor(...arg)
    this.push(newObj)
  }

  public static equals<U, V extends unknown[] = unknown[]>(
    queue1: Queue<U, V>,
    queue2: Queue<U, V>,
    comparator: (a: U, b: U) => boolean = (a, b) => a === b,
  ): boolean {
    if (queue1.length !== queue2.length) return false
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
      throw new TypeError('Input value must be a queue data structure')
    }
    const tempHead = queue1.#head
    const tempTail = queue1.#tail
    const tempLength = queue1.length

    queue1.#head = queue2.#head
    queue1.#tail = queue2.#tail
    queue1.length = queue2.length

    queue2.#head = tempHead
    queue2.#tail = tempTail
    queue2.length = tempLength
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

  public isEmpty(): boolean {
    return this.length === 0
  }

  public clear(): void {
    let current = this.#head
    while (current !== null) {
      const next = current.next
      current.cleanup()
      current = next
    }
    this.#head = this.#tail = null
    this.length = 0
  }

  public toArray(): T[] {
    return [...this]
  }

  #initQueue(values?: T[]) {
    if (!values) return
    if (!Array.isArray(values)) {
      throw new TypeError('Invalid argument type: new Queue()')
    }
    if (values.length === 0) return
    for (const value of values) {
      this.push(value)
    }
  }
}
