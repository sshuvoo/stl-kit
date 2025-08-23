import { describe, it, expect, beforeEach } from 'vitest'
import { PriorityQueue } from './../structures/priority-queue'

describe('PriorityQueue', () => {
  let pq: PriorityQueue<number>

  beforeEach(() => {
    pq = new PriorityQueue<number>()
  })

  describe('constructor', () => {
    it('should initialize empty by default', () => {
      expect(pq.isEmpty()).toBe(true)
      expect(pq.size()).toBe(0)
      expect(pq.peek()).toBeUndefined()
    })

    it('should initialize with values and heapify', () => {
      const p = new PriorityQueue<number>({ initValues: [1, 5, 3, 2] })
      expect(p.size()).toBe(4)
      // top should be max when using default numeric comparator
      expect(p.peek()).toBeGreaterThanOrEqual(5)
    })

    it('should throw when initValues is not array', () => {
      // @ts-expect-error
      expect(() => new PriorityQueue({ initValues: 123 })).toThrow()
    })
  })

  describe('push & pop & peek', () => {
    it('should push and pop maintaining priority (max-heap)', () => {
      pq.push(1)
      pq.push(5)
      pq.push(3)
      expect(pq.peek()).toBe(5)
      expect(pq.pop()).toBe(5)
      expect(pq.pop()).toBe(3)
      expect(pq.pop()).toBe(1)
      expect(pq.isEmpty()).toBe(true)
    })

    it('pop should throw on empty', () => {
      expect(() => pq.pop()).toThrow()
    })

    it('replace should replace root and return old root', () => {
      pq.push(2)
      pq.push(4)
      const old = pq.replace(10)
      expect(old).toBe(4)
      expect(pq.peek()).toBe(10)
    })

    it('replace should throw on empty', () => {
      expect(() => pq.replace(1)).toThrow()
    })
  })

  describe('emplace', () => {
    it('should use factory to emplace elements', () => {
      const p = new PriorityQueue<number, [number, number]>({
        factory: (a, b) => a + b,
      })
      p.emplace(2, 3)
      expect(p.size()).toBe(1)
      expect(p.peek()).toBe(5)
    })

    it('should throw if emplace used without factory', () => {
      // pq was created without factory
      expect(() => pq.emplace(1, 2)).toThrow()
    })
  })

  describe('iterator & toArray', () => {
    it('iterator yields heap array order and toArray returns shallow copy', () => {
      pq.push(2)
      pq.push(9)
      pq.push(6)
      const arr = pq.toArray()
      expect(Array.isArray(arr)).toBe(true)
      expect(arr).toEqual([...pq])
      // ensure toArray is shallow copy
      arr[0] = 999
      expect(pq.peek()).not.toBe(999)
    })
  })

  describe('clear & size & isEmpty', () => {
    it('should clear and report size correctly', () => {
      pq.push(1)
      pq.push(2)
      expect(pq.size()).toBe(2)
      pq.clear()
      expect(pq.size()).toBe(0)
      expect(pq.isEmpty()).toBe(true)
    })
  })

  describe('custom comparator', () => {
    it('should support min-heap with custom comparator', () => {
      const p = new PriorityQueue<number>({
        compareFn: (a, b) => b - a, // invert to create min-heap behaviour
      })
      p.push(5)
      p.push(1)
      p.push(3)
      expect(p.pop()).toBe(1)
      expect(p.pop()).toBe(3)
      expect(p.pop()).toBe(5)
    })

    it('should throw if default comparator used with non-number', () => {
      // default comparator only supports numbers; use any to bypass TS checks
      const p = new PriorityQueue<string>({ initValues: ['b'] })
      expect(() => p.push('a')).toThrow()
    })
  })

  describe('edge cases & large inputs', () => {
    it('should handle single element correctly', () => {
      pq.push(42)
      expect(pq.size()).toBe(1)
      expect(pq.peek()).toBe(42)
      expect(pq.pop()).toBe(42)
      expect(pq.isEmpty()).toBe(true)
    })

    it('should handle many inserts and pops', () => {
      const p = new PriorityQueue<number>()
      const n = 1000
      for (let i = 0; i < n; i++) p.push(Math.floor(Math.random() * n))
      let prev = Infinity
      while (!p.isEmpty()) {
        const cur = p.pop()
        expect(cur).toBeLessThanOrEqual(prev)
        prev = cur
      }
    })
  })
})
