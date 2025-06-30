import { ListNode } from '@/core/list-node'

type Constructor<T, A extends unknown[] = unknown[]> = new (...args: A) => T

export class Stack<T, A extends unknown[] = unknown[]> {
  #head: ListNode<T> | null
  public length: number
  #TypeCtor?: Constructor<T, A>
  constructor(values?: T[], TypeCtor?: Constructor<T, A>) {
    this.#head = null
    this.length = 0
    this.#initStack(values)
    this.#TypeCtor = TypeCtor
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
    this.length++

    // Empty Stack
    if (this.#head == null) {
      this.#head = newNode
      return
    }
    // Not Empty
    newNode.next = this.#head
    this.#head = newNode
  }

  public pop(): T | undefined {
    if (this.#head == null) return
    this.length--
    const popped = this.#head
    const val = popped.val
    this.#head = this.#head.next
    popped.cleanup()
    return val
  }

  public emplace(...arg: A): void {
    if (!this.#TypeCtor) throw new Error('No type class constructor provided')
    const newObj = new this.#TypeCtor(...arg)
    this.push(newObj)
  }

  public static equals<U, V extends unknown[] = unknown[]>(
    stack1: Stack<U, V>,
    stack2: Stack<U, V>,
  ): boolean {
    if (stack1.length !== stack2.length) return false
    function backtrack(
      head1: ListNode<U> | null,
      head2: ListNode<U> | null,
    ): boolean {
      if (head1 === null || head2 === null) {
        return head1 === head2
      }
      if (head1.val !== head2.val) return false
      return backtrack(head1.next, head2.next)
    }
    return backtrack(stack1.#head, stack2.#head)
  }

  public static swap<U, V extends unknown[] = unknown[]>(
    stack1: Stack<U, V>,
    stack2: Stack<U, V>,
  ): void {
    if (!(stack1 instanceof Stack && stack2 instanceof Stack)) {
      throw new TypeError('Input value must be a stack data structure')
    }
    const tempHead = stack1.#head
    const tempLength = stack1.length

    stack1.#head = stack2.#head
    stack1.length = stack2.length

    stack2.#head = tempHead
    stack2.length = tempLength
  }

  public get top(): T | undefined {
    if (this.#head == null) return
    return this.#head.val
  }

  public set top(val: T) {
    if (this.#head == null) return
    this.pop()
    this.push(val)
  }

  public isEmpty(): boolean {
    return this.#head === null || this.length === 0
  }

  public clear(): void {
    while (!this.isEmpty()) {
      this.pop()
    }
  }

  #initStack(values?: T[]) {
    if (!values) return
    if (!Array.isArray(values)) {
      throw new TypeError('Invalid argument type: new Stack()')
    }
    if (values.length === 0) return
    for (const value of values) {
      this.push(value)
    }
  }
}
