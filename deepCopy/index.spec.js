import { describe, expect, it } from 'vitest'
import { deepCopy } from '.'

describe('deepCopy', () => {
  it('should deep copy an object', () => {
    const obj = { a: 1, b: { c: 2 } }
    const copy = deepCopy(obj)
    expect(copy).toEqual(obj)
    expect(copy).not.toBe(obj)
    expect(copy.b).not.toBe(obj.b)
  })

  it('should deep copy an array', () => {
    const arr = [1, [2, 3]]
    const copy = deepCopy(arr)
    expect(copy).toEqual(arr)
    expect(copy).not.toBe(arr)
    expect(copy[1]).not.toBe(arr[1])
  })

  it('should deep copy a date', () => {
    const date = new Date()
    const copy = deepCopy(date)
    expect(copy).toEqual(date)
    expect(copy).not.toBe(date)
  })

  it('should deep copy a regexp', () => {
    const regexp = /abc/
    const copy = deepCopy(regexp)
    expect(copy).toEqual(regexp)
    expect(copy).not.toBe(regexp)
  })

  it('should deep copy a object has circular reference', () => {
    const a = { b: null, d: { e: 2 } }
    const b = { a, c: 1 }
    a.b = b
    const copy = deepCopy(a)
    expect(copy).toEqual(a)
    expect(copy).not.toBe(a)
    a.d.e = 3
    expect(copy.d.e).toBe(2)
  })
})
