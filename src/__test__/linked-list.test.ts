import { LinkedList } from 'src/structures/linked-list'
import { describe, it, expect } from 'vitest'

describe('LinkedList', () => {
  it('Push & Pop', () => {
    const list = new LinkedList<number>()
    list.pushBack(42)
    expect(list.back).toBe(42)
    list.pushBack(20)
    expect(list.back).toBe(20)
    list.pushFront(50)
    expect(list.front).toBe(50)
    list.front = 400
    expect(list.front).toBe(400)
  })
})
