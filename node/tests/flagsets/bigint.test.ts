import { BigBitFlagSet } from '~'
import { describe, expect, test } from 'vitest'

describe(BigBitFlagSet, () => {
    test('none', () => {
        const flags = new BigBitFlagSet()

        expect(flags.none()).toEqual(0n)
    })

    test('union', () => {
        const flags = new BigBitFlagSet()

        expect(flags.union(0n, 0n)).toEqual(0n)
        expect(flags.union(1n, 0n)).toEqual(1n)
        expect(flags.union(0n, 2n)).toEqual(2n)
        expect(flags.union(1n, 2n)).toEqual(3n)
        expect(flags.union(3n, 6n)).toEqual(7n)
    })

    test('difference', () => {
        const flags = new BigBitFlagSet()

        expect(flags.difference(0n, 0n)).toEqual(0n)
        expect(flags.difference(1n, 0n)).toEqual(1n)
        expect(flags.difference(3n, 6n)).toEqual(1n)
        expect(flags.difference(6n, 3n)).toEqual(4n)
        expect(flags.difference(8n, 17n)).toEqual(8n)
    })

    test('intersection', () => {
        const flags = new BigBitFlagSet()

        expect(flags.intersection(0n, 0n)).toEqual(0n)
        expect(flags.intersection(1n, 0n)).toEqual(0n)
        expect(flags.intersection(1n, 2n)).toEqual(0n)
        expect(flags.intersection(1n, 3n)).toEqual(1n)
        expect(flags.intersection(11n, 5n)).toEqual(1n)
        expect(flags.intersection(11n, 7n)).toEqual(3n)
    })

    test('isSuperset', () => {
        const flags = new BigBitFlagSet()

        expect(flags.isSuperset(0n, 0n)).toBe(true)
        expect(flags.isSuperset(3n, 0n)).toBe(true)
        expect(flags.isSuperset(3n, 1n)).toBe(true)
        expect(flags.isSuperset(3n, 3n)).toBe(true)
        expect(flags.isSuperset(0n, 3n)).toBe(false)
        expect(flags.isSuperset(8n, 4n)).toBe(false)
    })

    test('enumerate', () => {
        const flags = new BigBitFlagSet()

        expect([...flags.enumerate(0n)]).toEqual([])
        expect([...flags.enumerate(1n)]).toEqual([1n])
        expect([...flags.enumerate(2n)]).toEqual([2n])
        expect([...flags.enumerate(3n)]).toEqual([1n, 2n])
        expect([...flags.enumerate(11n)]).toEqual([1n, 2n, 8n])
        expect([...flags.enumerate(100n)]).toEqual([4n, 32n, 64n])
    })
})
