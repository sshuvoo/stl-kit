import { describe, it, expect, beforeEach } from 'vitest'
import { LinkedList } from './../structures/linked-list'
import { ListNode } from './../core/list-node'

describe('LinkedList', () => {
  let list: LinkedList<number>

  beforeEach(() => {
    list = new LinkedList<number>()
  })

  describe('constructor', () => {
    it('should initialize empty', () => {
      expect(list.length).toBe(0)
      expect(list.front).toBeUndefined()
      expect(list.back).toBeUndefined()
      expect(list.isEmpty()).toBe(true)
    })
    it('should initialize with values', () => {
      const l = new LinkedList<number>({ initValues: [1, 2, 3] })
      expect(l.length).toBe(3)
      expect(l.front).toBe(1)
      expect(l.back).toBe(3)
      expect([...l]).toEqual([1, 2, 3])
    })
    it('should throw if initValues is not array', () => {
      // @ts-expect-error
      expect(() => new LinkedList({ initValues: 123 })).toThrow()
    })
  })

  describe('pushFront & pushBack', () => {
    it('should add to front and back', () => {
      list.pushFront(2)
      list.pushFront(1)
      list.pushBack(3)
      expect([...list]).toEqual([1, 2, 3])
      expect(list.length).toBe(3)
    })
  })

  describe('popFront & popBack', () => {
    beforeEach(() => {
      list.assign([1, 2, 3])
    })
    it('should remove from front', () => {
      expect(list.popFront()).toBe(1)
      expect([...list]).toEqual([2, 3])
      expect(list.length).toBe(2)
    })
    it('should remove from back', () => {
      expect(list.popBack()).toBe(3)
      expect([...list]).toEqual([1, 2])
      expect(list.length).toBe(2)
    })
    it('should return undefined on empty', () => {
      list.clear()
      expect(list.popFront()).toBeUndefined()
      expect(list.popBack()).toBeUndefined()
    })
    it('should handle single element', () => {
      list.clear()
      list.pushBack(42)
      expect(list.popFront()).toBe(42)
      expect(list.length).toBe(0)
      list.pushBack(99)
      expect(list.popBack()).toBe(99)
      expect(list.length).toBe(0)
    })
  })

  describe('insertAt', () => {
    it('should insert at head, tail, and middle', () => {
      list.pushBack(1)
      list.pushBack(3)
      list.insertAt(2, 1)
      expect([...list]).toEqual([1, 2, 3])
      list.insertAt(0, 0)
      expect([...list]).toEqual([0, 1, 2, 3])
      list.insertAt(4, 4)
      expect([...list]).toEqual([0, 1, 2, 3, 4])
    })
    it('should throw on invalid index', () => {
      expect(() => list.insertAt(1, -1)).toThrow()
      expect(() => list.insertAt(1, 2)).toThrow()
    })
  })

  describe('eraseAt', () => {
    beforeEach(() => {
      list.assign([1, 2, 3, 4])
    })
    it('should erase at head, tail, and middle', () => {
      expect(list.eraseAt(0)).toBe(1)
      expect([...list]).toEqual([2, 3, 4])
      expect(list.eraseAt(2)).toBe(4)
      expect([...list]).toEqual([2, 3])
      expect(list.eraseAt(1)).toBe(3)
      expect([...list]).toEqual([2])
    })
    it('should throw on invalid index', () => {
      expect(() => list.eraseAt(-1)).toThrow()
      expect(() => list.eraseAt(10)).toThrow()
    })
    it('should return undefined on empty', () => {
      list.clear()
      expect(list.eraseAt(0)).toBeUndefined()
    })
  })

  describe('emplaceFront, emplaceBack, emplaceAt', () => {
    it('should use factory if provided', () => {
      const l = new LinkedList<number, [number, number]>({
        factory: (a, b) => a + b,
      })
      l.emplaceFront(1, 2)
      l.emplaceBack(3, 4)
      l.emplaceAt(1, 5, 6)
      expect([...l]).toEqual([3, 11, 7])
    })
    it('should fallback to first arg if no factory', () => {
      list.emplaceFront(10)
      list.emplaceBack(20)
      list.emplaceAt(1, 15)
      expect([...list]).toEqual([10, 15, 20])
    })
  })

  describe('isEmpty & clear', () => {
    it('should clear the list', () => {
      list.assign([1, 2, 3])
      list.clear()
      expect(list.length).toBe(0)
      expect(list.isEmpty()).toBe(true)
      expect([...list]).toEqual([])
    })
  })

  describe('toArray', () => {
    it('should convert to array', () => {
      list.assign([1, 2, 3])
      expect(list.toArray()).toEqual([1, 2, 3])
    })
  })

  describe('assign', () => {
    it('should assign from array', () => {
      list.assign([1, 2, 3])
      expect([...list]).toEqual([1, 2, 3])
    })
    it('should assign from array with slice', () => {
      list.assign([1, 2, 3, 4, 5], 1, 4)
      expect([...list]).toEqual([2, 3, 4])
    })
    it('should assign count and value', () => {
      list.assign(3, 7)
      expect([...list]).toEqual([7, 7, 7])
    })
    it('should throw on invalid args', () => {
      // @ts-expect-error
      expect(() => list.assign('foo')).toThrow()
      expect(() => list.assign([1, 2], 2, 1)).toThrow()
      expect(() => list.assign(-1, 2)).toThrow()
    })
  })

  describe('forEach', () => {
    it('should iterate with callback', () => {
      list.assign([1, 2, 3])
      const arr: number[] = []
      list.forEach((v) => {
        arr.push(v)
      })
      expect(arr).toEqual([1, 2, 3])
    })
    it('should break if callback returns false', () => {
      list.assign([1, 2, 3])
      const arr: number[] = []
      list.forEach((v) => {
        arr.push(v)
        if (v === 2) return false
      })
      expect(arr).toEqual([1, 2])
    })
    it('should throw if callback is not function', () => {
      // @ts-expect-error
      expect(() => list.forEach(123)).toThrow()
    })
  })

  describe('reverse', () => {
    it('should reverse the list', () => {
      list.assign([1, 2, 3])
      list.reverse()
      expect([...list]).toEqual([3, 2, 1])
    })
    it('should do nothing for empty or single', () => {
      list.reverse()
      expect([...list]).toEqual([])
      list.pushBack(1)
      list.reverse()
      expect([...list]).toEqual([1])
    })
  })

  describe('remove', () => {
    it('should remove all matching values', () => {
      list.assign([1, 2, 3, 2, 4, 2])
      const count = list.remove(2)
      expect(count).toBe(3)
      expect([...list]).toEqual([1, 3, 4])
    })
    it('should use custom compareFn', () => {
      const list = new LinkedList<string>()
      list.assign(['a', 'b', 'A', 'B'])

      const count = list.remove(
        'a',
        (a, b) => a.toLowerCase() === b.toLowerCase(),
      )
      expect(count).toBe(2)
      expect([...list]).toEqual(['b', 'B'])
    })
    it('should throw if compareFn is not function', () => {
      list.assign([1]) // Ensure list is not empty
      // @ts-expect-error
      expect(() => list.remove(1, 123)).toThrow()
    })
    it('should return 0 if empty', () => {
      expect(list.remove(1)).toBe(0)
    })
  })

  // describe('unique', () => {
  //   it('should remove consecutive duplicates', () => {
  //     list.assign([1, 1, 2, 2, 2, 3, 1, 1])
  //     list.unique()
  //     expect([...list]).toEqual([1, 2, 3, 1])
  //   })
  //   it('should use custom compareFn', () => {
  //     list.assign(['a', 'A', 'b', 'B', 'b'] as any)
  //     list.unique((a, b) => a.toLowerCase() === b.toLowerCase())
  //     expect([...list]).toEqual(['a', 'b'])
  //   })
  //   it('should do nothing for empty or single', () => {
  //     list.unique()
  //     expect([...list]).toEqual([])
  //     list.pushBack(1)
  //     list.unique()
  //     expect([...list]).toEqual([1])
  //   })
  // })

  describe('front & back getters/setters', () => {
    it('should get and set front and back', () => {
      list.assign([1, 2, 3])
      expect(list.front).toBe(1)
      expect(list.back).toBe(3)
      list.front = 10
      list.back = 30
      expect([...list]).toEqual([10, 2, 30])
    })
    it('should do nothing if empty', () => {
      list.front = 1
      list.back = 2
      expect(list.front).toBeUndefined()
      expect(list.back).toBeUndefined()
    })
  })

  describe('static swap', () => {
    it('should swap two lists', () => {
      const l1 = new LinkedList<number>({ initValues: [1, 2] })
      const l2 = new LinkedList<number>({ initValues: [3, 4, 5] })
      LinkedList.swap(l1, l2)
      expect([...l1]).toEqual([3, 4, 5])
      expect([...l2]).toEqual([1, 2])
    })
    it('should throw if not LinkedList', () => {
      expect(() => LinkedList.swap(list, null)).toThrow()
    })
  })

  describe('static merge', () => {
    it('should merge sorted lists', () => {
      const l1 = new LinkedList<number>({ initValues: [1, 3, 5] })
      const l2 = new LinkedList<number>({ initValues: [2, 4, 6] })
      LinkedList.merge(l1, l2)
      expect([...l1]).toEqual([1, 2, 3, 4, 5, 6])
      expect([...l2]).toEqual([])
    })
    it('should merge with custom compareFn', () => {
      const l1 = new LinkedList<string>({ initValues: ['b', 'd'] })
      const l2 = new LinkedList<string>({ initValues: ['a', 'c', 'e'] })
      LinkedList.merge(l1, l2, (a, b) => a.localeCompare(b))
      expect([...l1]).toEqual(['a', 'b', 'c', 'd', 'e'])
      expect([...l2]).toEqual([])
    })
    it('should throw if not LinkedList', () => {
      expect(() => LinkedList.merge(list, null)).toThrow()
    })
    it('should throw if compareFn is not function', () => {
      // @ts-expect-error
      expect(() => LinkedList.merge(list, list, 123)).toThrow()
    })
    it('should throw if merging with self', () => {
      expect(() => LinkedList.merge(list, list)).toThrow()
    })
  })

  describe('static buildNodes', () => {
    it('should build nodes from array', () => {
      const { head, tail } = LinkedList.buildNodes([1, 2, 3])
      expect(head).toBeInstanceOf(ListNode)
      expect(tail).toBeInstanceOf(ListNode)
      expect(head!.val).toBe(1)
      expect(tail!.val).toBe(3)
      // Traverse
      const arr: number[] = []
      let curr = head
      while (curr) {
        arr.push(curr.val)
        curr = curr.next
      }
      expect(arr).toEqual([1, 2, 3])
    })
    it('should return nulls for empty array', () => {
      const { head, tail } = LinkedList.buildNodes([])
      expect(head).toBeNull()
      expect(tail).toBeNull()
    })
    it('should throw if not array', () => {
      // @ts-expect-error
      expect(() => LinkedList.buildNodes(123)).toThrow()
    })
  })

  describe('iteration', () => {
    it('should iterate forward and backward', () => {
      list.assign([1, 2, 3])
      expect([...list]).toEqual([1, 2, 3])
      expect([...list.rbegin()]).toEqual([3, 2, 1])
      expect([...list.begin()]).toEqual([1, 2, 3])
    })
  })
})
