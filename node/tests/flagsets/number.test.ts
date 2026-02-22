import { BitFlagSet, createBitFlagSet } from '~'
import { describe, expect, test } from 'vitest'

describe(BitFlagSet, () => {
    test('none', () => {
        const flags = createBitFlagSet([])

        expect(flags.none()).toEqual(0)
    })

    test('of', () => {
        const flags = createBitFlagSet([])

        expect(flags.of()).toEqual(0)
        expect(flags.of(1)).toEqual(1)
        expect(flags.of(3, 8)).toEqual(11)
        expect(flags.of(3, 5, 2)).toEqual(7)
    })

    test('named', () => {
        const flags = createBitFlagSet([
            { value: 1, as: 'A' },
            { value: 2, as: 'B' },
            { value: 4, as: 'C' },
            { value: 8, as: 'D' },
            { compose: ['A', 'B'], as: 'AB' },
            { compose: ['A', 'C'], as: 'AC' },
        ])

        expect(flags.named()).toEqual(0)
        expect(flags.named('A')).toEqual(1)
        expect(flags.named('AB', 'D')).toEqual(11)
        expect(flags.named('AB', 'AC', 'B')).toEqual(7)
    })

    test('union', () => {
        const flags = createBitFlagSet([])

        expect(flags.union(0, 0)).toEqual(0)
        expect(flags.union(1, 0)).toEqual(1)
        expect(flags.union(0, 2)).toEqual(2)
        expect(flags.union(1, 2)).toEqual(3)
        expect(flags.union(3, 6)).toEqual(7)
    })

    test('difference', () => {
        const flags = createBitFlagSet([])

        expect(flags.difference(0, 0)).toEqual(0)
        expect(flags.difference(1, 0)).toEqual(1)
        expect(flags.difference(3, 6)).toEqual(1)
        expect(flags.difference(6, 3)).toEqual(4)
        expect(flags.difference(8, 17)).toEqual(8)
    })

    test('intersection', () => {
        const flags = createBitFlagSet([])

        expect(flags.intersection(0, 0)).toEqual(0)
        expect(flags.intersection(1, 0)).toEqual(0)
        expect(flags.intersection(1, 2)).toEqual(0)
        expect(flags.intersection(1, 3)).toEqual(1)
        expect(flags.intersection(11, 5)).toEqual(1)
        expect(flags.intersection(11, 7)).toEqual(3)
    })

    test('isSuperset', () => {
        const flags = createBitFlagSet([])

        expect(flags.isSuperset(0, 0)).toBe(true)
        expect(flags.isSuperset(3, 0)).toBe(true)
        expect(flags.isSuperset(3, 1)).toBe(true)
        expect(flags.isSuperset(3, 3)).toBe(true)
        expect(flags.isSuperset(0, 3)).toBe(false)
        expect(flags.isSuperset(8, 4)).toBe(false)
    })

    test('enumerate', () => {
        const flags = createBitFlagSet([])

        expect([...flags.enumerate(0)]).toEqual([])
        expect([...flags.enumerate(1)]).toEqual([1])
        expect([...flags.enumerate(2)]).toEqual([2])
        expect([...flags.enumerate(3)]).toEqual([1, 2])
        expect([...flags.enumerate(11)]).toEqual([1, 2, 8])
        expect([...flags.enumerate(100)]).toEqual([4, 32, 64])
    })
})
