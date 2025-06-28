import { ListNode } from '@/core/list-node'

export class LinkedList<T> {
  #head: ListNode<T> | null
  #tail: ListNode<T> | null
  public length: number

  constructor(values?: T[]) {
    this.#head = this.#tail = null
    this.length = 0
    this.#_initList(values)
  }

  public reverse(): void {
    if (this.length <= 1) return

    let prev: ListNode<T> | null = null
    let curr: ListNode<T> | null = this.#head
    let next: ListNode<T> | null = null

    while (curr != null) {
      next = curr.next

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

  // Overload signatures
  public assign(count: number, value: T): void
  public assign(values: T[], start?: number, end?: number): void

  // Implementation
  public assign(arg1: number | T[], arg2?: T | number, arg3?: number): void {
    // Case: assign(values: T[], start?: number, end?: number)
    if (Array.isArray(arg1)) {
      const values = arg1
      const start = typeof arg2 === 'number' ? arg2 : 0
      const end = typeof arg3 === 'number' ? arg3 : values.length - 1

      if (start < 0 || end >= values.length || start > end) {
        throw new RangeError('Invalid array index range')
      }

      this.clear()
      for (let i = start; i <= end; i++) {
        this.pushBack(values[i]!)
      }
      return
    }

    // Case: assign(count: number, value: T)
    if (typeof arg1 === 'number' && arg2 != undefined) {
      const count = arg1
      const value = arg2 as T

      if (count < 0) {
        throw new RangeError('Count cannot be negative')
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

  public [Symbol.iterator](): Iterator<T> {
    let current = this.#head
    return {
      next(): IteratorResult<T> {
        // End condition
        if (current === null) {
          return { done: true, value: undefined }
        }
        const value = current.val
        current = current.next
        return { done: false, value }
      },
    }
  }

  public begin(): Iterator<T> {
    return this[Symbol.iterator]()
  }

  public pushFront(value: T): void {
    const newNode = new ListNode(value)
    this.length++
    if (this.length === 0 || this.#head === null) {
      this.#head = this.#tail = newNode
      return
    }
    this.#head.prev = newNode
    newNode.next = this.#head
    this.#head = newNode
  }

  public pushBack(value: T): void {
    const newNode = new ListNode(value)
    this.length++
    if (this.length === 0 || this.#tail === null) {
      this.#head = this.#tail = newNode
      return
    }
    newNode.prev = this.#tail
    this.#tail.next = newNode
    this.#tail = newNode
  }

  public popFront(): T | void {
    // No node
    if (this.length === 0 || this.#head === null) return
    this.length--
    const popped = this.#head
    const value = popped.val

    // Single Node
    if (this.length === 1 || this.#head === this.#tail) {
      this.#head = this.#tail = null
      this.#_cleanup(popped)
      return value
    }

    // Two and more nodes
    this.#head = this.#head.next
    this.#head!.prev = null
    this.#_cleanup(popped)
    return value
  }

  public popBack(): T | void {
    // No Node
    if (this.length === 0 || this.#tail === null) return

    this.length--
    const popped = this.#tail
    const value = popped.val

    // Single node case
    if (this.length === 1 || this.#head === this.#tail) {
      this.#head = this.#tail = null
      this.#_cleanup(popped)
      return value
    }

    // Two or more case
    const prevNode = this.#tail.prev!
    prevNode.next = null
    this.#tail = prevNode
    this.#_cleanup(popped)
    return value
  }

  public insertAt(val: T, at: number): void {
    if (at < 0 || at > this.length) {
      throw new Error('Invalid position')
    }

    if (at === 0) {
      this.pushFront(val)
      return
    }

    if (at === this.length) {
      this.pushBack(val)
      return
    }

    let curr = this.#head
    let i = 0
    while (i < at - 1 && curr != null) {
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
    this.length++
  }

  public eraseAt(at: number): T | void {
    if (this.isEmpty()) return
    if (at < 0 || at >= this.length) {
      throw new Error('Invalid position')
    }
    if (at === 0) return this.popFront()
    if (at === this.length - 1) return this.popBack()

    let curr = this.#head
    let i = 0
    while (curr != null && i < at) {
      curr = curr.next
    }
    const prevNode = curr!.prev!
    const nextNode = curr!.next!
    prevNode.next = nextNode
    nextNode.prev = prevNode
    const value = curr!.val
    this.#_cleanup(curr!)
    return value
  }

  public isEmpty(): boolean {
    return this.length === 0
  }

  public get front(): T | void {
    if (this.isEmpty() || this.#head === null) return
    return this.#head.val
  }

  public set front(val: T) {
    if (this.isEmpty() || this.#head === null) return
    this.popFront()
    this.pushFront(val)
  }

  public get back(): T | void {
    if (this.isEmpty() || this.#tail === null) return
    return this.#tail.val
  }

  public set back(val: T) {
    if (this.isEmpty() || this.#tail === null) return
    this.popBack()
    this.pushBack(val)
  }

  public clear(): void {
    if (this.isEmpty()) return
    let curr = this.#head
    while (curr != null) {
      const nextNode = curr.next
      this.#_cleanup(curr)
      curr = nextNode
    }
    this.#head = this.#tail = null
    this.length = 0
  }

  public forEach(callback: (value: T, index: number) => void | false): void {
    let curr = this.#head
    let index = 0
    while (curr != null) {
      const res = callback(curr.val, index)
      if (res === false) break
      curr = curr.next
      index++
    }
  }

  #_cleanup(node: ListNode<T>): void {
    node.next = node.prev = null
    ;(node.val as any) = null
  }

  #_initList(values?: T[]): void {
    if (values === undefined || values === null) return

    if (!Array.isArray(values)) {
      throw new TypeError('Expected an array to initialize the list.')
    }

    if (values.length === 0) return

    for (const item of values) {
      this.pushBack(item)
    }
  }
}
