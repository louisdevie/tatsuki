import { describe, expect, test } from 'vitest'

import { BigBitFlagSet, BitFlags, createBigBitFlagSet } from '~'

describe(BigBitFlagSet, () => {
    test('none', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.none()).toEqual(0n)
    })

    test('of', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.of()).toEqual(0n)
        expect(flags.of(1n)).toEqual(1n)
        expect(flags.of(3n, 8n)).toEqual(11n)
        expect(flags.of(3n, 5n, 2n)).toEqual(7n)
    })

    test('named', () => {
        const flags = createBigBitFlagSet([
            { value: 1n, as: 'A' },
            { value: 2n, as: 'B' },
            { value: 4n, as: 'C' },
            { value: 8n, as: 'D' },
            { compose: ['A', 'B'], as: 'AB' },
            { compose: ['A', 'C'], as: 'AC' },
        ])

        expect(flags.named()).toEqual(0n)
        expect(flags.named('A')).toEqual(1n)
        expect(flags.named('AB', 'D')).toEqual(11n)
        expect(flags.named('AB', 'AC', 'B')).toEqual(7n)
    })

    test('union', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.union(0n, 0n)).toEqual(0n)
        expect(flags.union(1n, 0n)).toEqual(1n)
        expect(flags.union(0n, 2n)).toEqual(2n)
        expect(flags.union(1n, 2n)).toEqual(3n)
        expect(flags.union(3n, 6n)).toEqual(7n)
    })

    test('difference', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.difference(0n, 0n)).toEqual(0n)
        expect(flags.difference(1n, 0n)).toEqual(1n)
        expect(flags.difference(3n, 6n)).toEqual(1n)
        expect(flags.difference(6n, 3n)).toEqual(4n)
        expect(flags.difference(8n, 17n)).toEqual(8n)
    })

    test('intersection', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.intersection(0n, 0n)).toEqual(0n)
        expect(flags.intersection(1n, 0n)).toEqual(0n)
        expect(flags.intersection(1n, 2n)).toEqual(0n)
        expect(flags.intersection(1n, 3n)).toEqual(1n)
        expect(flags.intersection(11n, 5n)).toEqual(1n)
        expect(flags.intersection(11n, 7n)).toEqual(3n)
    })

    test('isSuperset', () => {
        const flags = createBigBitFlagSet([])

        expect(flags.isSuperset(0n, 0n)).toBe(true)
        expect(flags.isSuperset(3n, 0n)).toBe(true)
        expect(flags.isSuperset(3n, 1n)).toBe(true)
        expect(flags.isSuperset(3n, 3n)).toBe(true)
        expect(flags.isSuperset(0n, 3n)).toBe(false)
        expect(flags.isSuperset(8n, 4n)).toBe(false)
    })

    test('hasAny', () => {
        const flags = createBigBitFlagSet([
            { value: 1n, as: 'A' },
            { value: 2n, as: 'B', requires: ['A'] },
            { value: 4n, as: 'C', requires: ['A'] },
            { value: 8n, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAny(15n, 0n)).toBe(false)
        expect(flags.hasAny(0n, 0n)).toBe(false)
        expect(flags.hasAny(7n, 1n)).toBe(true)
        expect(flags.hasAny(1n, 7n)).toBe(true)
        expect(flags.hasAny(5n, 12n)).toBe(false)
        expect(flags.hasAny(2n, 2n)).toBe(false)
    })

    test('hasAll', () => {
        const flags = createBigBitFlagSet([
            { value: 1n, as: 'A' },
            { value: 2n, as: 'B', requires: ['A'] },
            { value: 4n, as: 'C', requires: ['A'] },
            { value: 8n, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.hasAll(15n, 0n)).toBe(true)
        expect(flags.hasAll(0n, 0n)).toBe(true)
        expect(flags.hasAll(7n, 2n)).toBe(true)
        expect(flags.hasAll(6n, 2n)).toBe(false)
        expect(flags.hasAll(1n, 7n)).toBe(false)
        expect(flags.hasAll(5n, 12n)).toBe(false)
    })

    test('enumerate', () => {
        const flags = createBigBitFlagSet([])

        expect([...flags.enumerate(0n)]).toEqual([])
        expect([...flags.enumerate(1n)]).toEqual([1n])
        expect([...flags.enumerate(2n)]).toEqual([2n])
        expect([...flags.enumerate(3n)]).toEqual([1n, 2n])
        expect([...flags.enumerate(11n)]).toEqual([1n, 2n, 8n])
        expect([...flags.enumerate(100n)]).toEqual([4n, 32n, 64n])
    })

    test('maximum', () => {
        const flags = createBigBitFlagSet([
            { value: 1n, as: 'A' },
            { value: 2n, as: 'B', requires: ['A'] },
            { value: 4n, as: 'C', requires: ['A'] },
            { value: 8n, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.maximum(0n)).toEqual(0n)
        expect(flags.maximum(1n)).toEqual(1n)
        expect(flags.maximum(2n)).toEqual(3n)
        expect(flags.maximum(3n)).toEqual(3n)
        expect(flags.maximum(4n)).toEqual(5n)
        expect(flags.maximum(8n)).toEqual(15n)
    })

    test('minimum', () => {
        const flags = createBigBitFlagSet([
            { value: 1n, as: 'A' },
            { value: 2n, as: 'B', requires: ['A'] },
            { value: 4n, as: 'C', requires: ['A'] },
            { value: 8n, as: 'D', requires: ['B', 'C'] },
        ])

        expect(flags.minimum(0n)).toEqual(0n)
        expect(flags.minimum(1n)).toEqual(1n)
        expect(flags.minimum(2n)).toEqual(0n)
        expect(flags.minimum(3n)).toEqual(3n)
        expect(flags.minimum(4n)).toEqual(0n)
        expect(flags.minimum(13n)).toEqual(5n)
    })
})

describe('BitFlags', () => {
    test('union', () => {
        expect(BitFlags.union(0n, 0n)).toEqual(0n)
        expect(BitFlags.union(1n, 0n)).toEqual(1n)
        expect(BitFlags.union(0n, 2n)).toEqual(2n)
        expect(BitFlags.union(1n, 2n)).toEqual(3n)
        expect(BitFlags.union(3n, 6n)).toEqual(7n)
    })

    test('difference', () => {
        expect(BitFlags.difference(0n, 0n)).toEqual(0n)
        expect(BitFlags.difference(1n, 0n)).toEqual(1n)
        expect(BitFlags.difference(3n, 6n)).toEqual(1n)
        expect(BitFlags.difference(6n, 3n)).toEqual(4n)
        expect(BitFlags.difference(8n, 17n)).toEqual(8n)
    })

    test('intersection', () => {
        expect(BitFlags.intersection(0n, 0n)).toEqual(0n)
        expect(BitFlags.intersection(1n, 0n)).toEqual(0n)
        expect(BitFlags.intersection(1n, 2n)).toEqual(0n)
        expect(BitFlags.intersection(1n, 3n)).toEqual(1n)
        expect(BitFlags.intersection(11n, 5n)).toEqual(1n)
        expect(BitFlags.intersection(11n, 7n)).toEqual(3n)
    })

    test('isSuperset', () => {
        expect(BitFlags.isSuperset(0n, 0n)).toBe(true)
        expect(BitFlags.isSuperset(3n, 0n)).toBe(true)
        expect(BitFlags.isSuperset(3n, 1n)).toBe(true)
        expect(BitFlags.isSuperset(3n, 3n)).toBe(true)
        expect(BitFlags.isSuperset(0n, 3n)).toBe(false)
        expect(BitFlags.isSuperset(8n, 4n)).toBe(false)
    })

    test('enumerate', () => {
        expect([...BitFlags.enumerate(0n)]).toEqual([])
        expect([...BitFlags.enumerate(1n)]).toEqual([1n])
        expect([...BitFlags.enumerate(2n)]).toEqual([2n])
        expect([...BitFlags.enumerate(3n)]).toEqual([1n, 2n])
        expect([...BitFlags.enumerate(11n)]).toEqual([1n, 2n, 8n])
        expect([...BitFlags.enumerate(100n)]).toEqual([4n, 32n, 64n])
    })
})
