import { describe, expect, test } from 'vitest'

import { Base64BitFlagSet, createBase64BitFlagSet } from '~'

describe(Base64BitFlagSet, () => {
    test('none', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.none()).toEqual('')
    })

    test('of', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.of()).toEqual('')
        expect(flags.of(1)).toEqual('B')
        expect(flags.of(2, 3)).toEqual('G')
    })

    test('named', () => {
        const flags = createBase64BitFlagSet([
            { ordinal: 1, as: 'A' },
            { ordinal: 2, as: 'B' },
            { ordinal: 3, as: 'C' },
            { ordinal: 4, as: 'D' },
            { compose: ['A', 'B'], as: 'AB' },
            { compose: ['A', 'C'], as: 'AC' },
        ])

        expect(flags.named()).toEqual('')
        expect(flags.named('A')).toEqual('B')
        expect(flags.named('AB', 'D')).toEqual('L')
        expect(flags.named('AB', 'AC', 'B')).toEqual('H')
    })

    test('union', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.union('', '')).toEqual('')
        expect(flags.union('A', 'A')).toEqual('')
        expect(flags.union('B', 'A')).toEqual('B')
        expect(flags.union('A', 'C')).toEqual('C')
        expect(flags.union('B', 'C')).toEqual('D')
        expect(flags.union('D', 'G')).toEqual('H')
    })

    test('difference', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.difference('', '')).toEqual('')
        expect(flags.difference('A', 'A')).toEqual('')
        expect(flags.difference('B', 'A')).toEqual('B')
        expect(flags.difference('D', 'G')).toEqual('B')
        expect(flags.difference('G', 'D')).toEqual('E')
        expect(flags.difference('IB', 'R')).toEqual('IB')
    })

    test('intersection', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.intersection('', '')).toEqual('')
        expect(flags.intersection('A', 'A')).toEqual('')
        expect(flags.intersection('B', 'A')).toEqual('')
        expect(flags.intersection('B', 'C')).toEqual('')
        expect(flags.intersection('B', 'D')).toEqual('B')
        expect(flags.intersection('L', 'F')).toEqual('B')
        expect(flags.intersection('L', 'H')).toEqual('D')
    })

    test('isSuperset', () => {
        const flags = createBase64BitFlagSet([])

        expect(flags.isSuperset('A', 'A')).toBe(true)
        expect(flags.isSuperset('D', 'A')).toBe(true)
        expect(flags.isSuperset('D', 'B')).toBe(true)
        expect(flags.isSuperset('D', 'D')).toBe(true)
        expect(flags.isSuperset('A', 'D')).toBe(false)
        expect(flags.isSuperset('I', 'E')).toBe(false)
    })

    test('hasAny', () => {
        const flags = createBase64BitFlagSet([
            { ordinal: 1, as: 'A' },
            { ordinal: 2, as: 'B', requires: ['A'] },
            { ordinal: 3, as: 'C', requires: ['A'] },
            { ordinal: 4, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAny('P', 'A')).toBe(false)
        expect(flags.hasAny('A', 'A')).toBe(false)
        expect(flags.hasAny('H', 'B')).toBe(true)
        expect(flags.hasAny('B', 'H')).toBe(true)
        expect(flags.hasAny('F', 'M')).toBe(false)
        expect(flags.hasAny('C', 'C')).toBe(false)
    })

    test('hasAll', () => {
        const flags = createBase64BitFlagSet([
            { ordinal: 1, as: 'A' },
            { ordinal: 2, as: 'B', requires: ['A'] },
            { ordinal: 3, as: 'C', requires: ['A'] },
            { ordinal: 4, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAll('P', 'A')).toBe(true)
        expect(flags.hasAll('A', 'A')).toBe(true)
        expect(flags.hasAll('H', 'C')).toBe(true)
        expect(flags.hasAll('G', 'C')).toBe(false)
        expect(flags.hasAll('B', 'H')).toBe(false)
        expect(flags.hasAll('F', 'M')).toBe(false)
    })

    test('enumerate', () => {
        const flags = createBase64BitFlagSet([])

        expect([...flags.enumerate('A')]).toEqual([])
        expect([...flags.enumerate('B')]).toEqual([1])
        expect([...flags.enumerate('C')]).toEqual([2])
        expect([...flags.enumerate('D')]).toEqual([1, 2])
        expect([...flags.enumerate('L')]).toEqual([1, 2, 4])
        expect([...flags.enumerate('kB')]).toEqual([3, 6, 7])
        expect([...flags.enumerate('AAB')]).toEqual([13])
    })

    test('maximum', () => {
        const flags = createBase64BitFlagSet([
            { ordinal: 1, as: 'A' },
            { ordinal: 2, as: 'B', requires: ['A'] },
            { ordinal: 3, as: 'C', requires: ['A'] },
            { ordinal: 4, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.maximum('A')).toEqual('')
        expect(flags.maximum('B')).toEqual('B')
        expect(flags.maximum('C')).toEqual('D')
        expect(flags.maximum('D')).toEqual('D')
        expect(flags.maximum('E')).toEqual('F')
        expect(flags.maximum('I')).toEqual('P')
    })

    test('minimum', () => {
        const flags = createBase64BitFlagSet([
            { ordinal: 1, as: 'A' },
            { ordinal: 2, as: 'B', requires: ['A'] },
            { ordinal: 3, as: 'C', requires: ['A'] },
            { ordinal: 4, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.minimum('A')).toEqual('')
        expect(flags.minimum('B')).toEqual('B')
        expect(flags.minimum('C')).toEqual('')
        expect(flags.minimum('D')).toEqual('D')
        expect(flags.minimum('E')).toEqual('')
        expect(flags.minimum('N')).toEqual('F')
    })
})
