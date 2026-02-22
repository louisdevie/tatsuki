import { Base64BitFlagSet } from '~'
import { describe, expect, test } from 'vitest'

describe(Base64BitFlagSet, () => {
    test('none', () => {
        const flags = new Base64BitFlagSet()

        expect(flags.none()).toEqual('')
    })

    test('union', () => {
        const flags = new Base64BitFlagSet()

        expect(flags.union('', '')).toEqual('')
        expect(flags.union('A', 'A')).toEqual('')
        expect(flags.union('B', 'A')).toEqual('B')
        expect(flags.union('A', 'C')).toEqual('C')
        expect(flags.union('B', 'C')).toEqual('D')
        expect(flags.union('D', 'G')).toEqual('H')
    })

    test('difference', () => {
        const flags = new Base64BitFlagSet()

        expect(flags.difference('', '')).toEqual('')
        expect(flags.difference('A', 'A')).toEqual('')
        expect(flags.difference('B', 'A')).toEqual('B')
        expect(flags.difference('D', 'G')).toEqual('B')
        expect(flags.difference('G', 'D')).toEqual('E')
        expect(flags.difference('IB', 'R')).toEqual('IB')
    })

    test('intersection', () => {
        const flags = new Base64BitFlagSet()

        expect(flags.intersection('', '')).toEqual('')
        expect(flags.intersection('A', 'A')).toEqual('')
        expect(flags.intersection('B', 'A')).toEqual('')
        expect(flags.intersection('B', 'C')).toEqual('')
        expect(flags.intersection('B', 'D')).toEqual('B')
        expect(flags.intersection('L', 'F')).toEqual('B')
        expect(flags.intersection('L', 'H')).toEqual('D')
    })

    test('isSuperset', () => {
        const flags = new Base64BitFlagSet()

        expect(flags.isSuperset('A', 'A')).toBe(true)
        expect(flags.isSuperset('D', 'A')).toBe(true)
        expect(flags.isSuperset('D', 'B')).toBe(true)
        expect(flags.isSuperset('D', 'D')).toBe(true)
        expect(flags.isSuperset('A', 'D')).toBe(false)
        expect(flags.isSuperset('I', 'E')).toBe(false)
    })

    test('enumerate', () => {
        const flags = new Base64BitFlagSet()

        expect([...flags.enumerate('A')]).toEqual([])
        expect([...flags.enumerate('B')]).toEqual([1])
        expect([...flags.enumerate('C')]).toEqual([2])
        expect([...flags.enumerate('D')]).toEqual([1, 2])
        expect([...flags.enumerate('L')]).toEqual([1, 2, 4])
        expect([...flags.enumerate('kB')]).toEqual([3, 6, 7])
        expect([...flags.enumerate('AAB')]).toEqual([13])
    })
})
