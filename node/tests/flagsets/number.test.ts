import { BitFlags, BitFlagSet, createBitFlagSet } from '~'
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

    test('hasAny', () => {
        const flags = createBitFlagSet([
            { value: 1, as: 'A' },
            { value: 2, as: 'B', requires: ['A'] },
            { value: 4, as: 'C', requires: ['A'] },
            { value: 8, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAny(15, 0)).toBe(false)
        expect(flags.hasAny(0, 0)).toBe(false)
        expect(flags.hasAny(7, 1)).toBe(true)
        expect(flags.hasAny(1, 7)).toBe(true)
        expect(flags.hasAny(5, 12)).toBe(false)
        expect(flags.hasAny(2, 2)).toBe(false)
    })

    test('hasAll', () => {
        const flags = createBitFlagSet([
            { value: 1, as: 'A' },
            { value: 2, as: 'B', requires: ['A'] },
            { value: 4, as: 'C', requires: ['A'] },
            { value: 8, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAll(15, 0)).toBe(true)
        expect(flags.hasAll(0, 0)).toBe(true)
        expect(flags.hasAll(7, 2)).toBe(true)
        expect(flags.hasAll(6, 2)).toBe(false)
        expect(flags.hasAll(1, 7)).toBe(false)
        expect(flags.hasAll(5, 12)).toBe(false)
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

    test('maximum', () => {
        const flags = createBitFlagSet([
            { value: 1, as: 'A' },
            { value: 2, as: 'B', requires: ['A'] },
            { value: 4, as: 'C', requires: ['A'] },
            { value: 8, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.maximum(0)).toEqual(0)
        expect(flags.maximum(1)).toEqual(1)
        expect(flags.maximum(2)).toEqual(3)
        expect(flags.maximum(3)).toEqual(3)
        expect(flags.maximum(4)).toEqual(5)
        expect(flags.maximum(8)).toEqual(15)
    })

    test('minimum', () => {
        const flags = createBitFlagSet([
            { value: 1, as: 'A' },
            { value: 2, as: 'B', requires: ['A'] },
            { value: 4, as: 'C', requires: ['A'] },
            { value: 8, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.minimum(0)).toEqual(0)
        expect(flags.minimum(1)).toEqual(1)
        expect(flags.minimum(2)).toEqual(0)
        expect(flags.minimum(3)).toEqual(3)
        expect(flags.minimum(4)).toEqual(0)
        expect(flags.minimum(13)).toEqual(5)
    })
})

describe('BitFlags', () => {
    test('union', () => {
        expect(BitFlags.union(0, 0)).toEqual(0)
        expect(BitFlags.union(1, 0)).toEqual(1)
        expect(BitFlags.union(0, 2)).toEqual(2)
        expect(BitFlags.union(1, 2)).toEqual(3)
        expect(BitFlags.union(3, 6)).toEqual(7)
    })

    test('difference', () => {
        expect(BitFlags.difference(0, 0)).toEqual(0)
        expect(BitFlags.difference(1, 0)).toEqual(1)
        expect(BitFlags.difference(3, 6)).toEqual(1)
        expect(BitFlags.difference(6, 3)).toEqual(4)
        expect(BitFlags.difference(8, 17)).toEqual(8)
    })

    test('intersection', () => {
        expect(BitFlags.intersection(0, 0)).toEqual(0)
        expect(BitFlags.intersection(1, 0)).toEqual(0)
        expect(BitFlags.intersection(1, 2)).toEqual(0)
        expect(BitFlags.intersection(1, 3)).toEqual(1)
        expect(BitFlags.intersection(11, 5)).toEqual(1)
        expect(BitFlags.intersection(11, 7)).toEqual(3)
    })

    test('isSuperset', () => {
        expect(BitFlags.isSuperset(0, 0)).toBe(true)
        expect(BitFlags.isSuperset(3, 0)).toBe(true)
        expect(BitFlags.isSuperset(3, 1)).toBe(true)
        expect(BitFlags.isSuperset(3, 3)).toBe(true)
        expect(BitFlags.isSuperset(0, 3)).toBe(false)
        expect(BitFlags.isSuperset(8, 4)).toBe(false)
    })

    test('enumerate', () => {
        expect([...BitFlags.enumerate(0)]).toEqual([])
        expect([...BitFlags.enumerate(1)]).toEqual([1])
        expect([...BitFlags.enumerate(2)]).toEqual([2])
        expect([...BitFlags.enumerate(3)]).toEqual([1, 2])
        expect([...BitFlags.enumerate(11)]).toEqual([1, 2, 8])
        expect([...BitFlags.enumerate(100)]).toEqual([4, 32, 64])
    })
})
