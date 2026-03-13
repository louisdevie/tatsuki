import { describe, expect, test } from 'vitest'

import { ArrayFlagSet, createArrayFlagSet } from '~'

describe(ArrayFlagSet, () => {
    test('none', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.none()).toEqual([])
    })

    test('of', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.of()).toEqual([])
        expect(flags.of('a')).toEqual(['a'])
        expect(flags.of('x', 'y', 'z')).toEqual(['x', 'y', 'z'])
    })

    test('named', () => {
        const flags = createArrayFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b' },
            { value: 78, as: 'c' },
            { compose: ['a', 'b'], as: 'ab' },
        ])

        expect(flags.named()).toEqual([])
        expect(flags.named('a')).toEqual([12])
        expect(flags.named('ab', 'c')).toEqual([12, 45, 78])
    })

    test('union', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.union([], [])).toEqual([])
        expect(flags.union(['A'], [])).toEqual(['A'])
        expect(flags.union([], ['B'])).toEqual(['B'])
        expect(flags.union(['A'], ['B'])).toEqual(['A', 'B'])
        expect(flags.union(['A', 'B'], ['B', 'C'])).toEqual(['A', 'B', 'C'])
    })

    test('difference', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.difference([], [])).toEqual([])
        expect(flags.difference(['A'], [])).toEqual(['A'])
        expect(flags.difference(['A', 'B'], ['B', 'C'])).toEqual(['A'])
        expect(flags.difference(['B', 'C'], ['A', 'B'])).toEqual(['C'])
        expect(flags.difference(['D'], ['A', 'E'])).toEqual(['D'])
    })

    test('intersection', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.intersection([], [])).toEqual([])
        expect(flags.intersection(['A'], [])).toEqual([])
        expect(flags.intersection(['A'], ['B'])).toEqual([])
        expect(flags.intersection(['A'], ['A', 'B'])).toEqual(['A'])
        expect(flags.intersection(['A', 'B', 'D'], ['A', 'C'])).toEqual(['A'])
        expect(flags.intersection(['A', 'B', 'D'], ['A', 'B', 'C'])).toEqual(['A', 'B'])
    })

    test('isSuperset', () => {
        const flags = createArrayFlagSet<string>([])

        expect(flags.isSuperset([], [])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], [])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], ['A'])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], ['A', 'B'])).toBe(true)
        expect(flags.isSuperset([], ['A', 'B'])).toBe(false)
        expect(flags.isSuperset(['C', 'D'], ['B'])).toBe(false)
    })

    test('hasAny', () => {
        const flags = createArrayFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c' },
        ])

        expect(flags.hasAny([], [])).toBe(false)
        expect(flags.hasAny([12, 45, 78], [])).toBe(false)
        expect(flags.hasAny([12, 45, 78], [12])).toBe(true)
        expect(flags.hasAny([12], [12, 78])).toBe(true)
        expect(flags.hasAny([45, 78], [45])).toBe(false)
    })

    test('hasAll', () => {
        const flags = createArrayFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c' },
        ])

        expect(flags.hasAll([], [])).toBe(true)
        expect(flags.hasAll([12, 45, 78], [])).toBe(true)
        expect(flags.hasAll([12, 45, 78], [12])).toBe(true)
        expect(flags.hasAll([12], [12, 78])).toBe(false)
        expect(flags.hasAll([45, 78], [45])).toBe(false)
    })

    test('enumerate', () => {
        const flags = createArrayFlagSet<string>([])

        expect([...flags.enumerate([])]).toEqual([])
        expect([...flags.enumerate(['A'])]).toEqual(['A'])
        expect([...flags.enumerate(['A', 'B', 'C'])]).toEqual(['A', 'B', 'C'])
    })

    test('maximum', () => {
        const flags = createArrayFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c', requires: ['b'] },
        ])

        expect(flags.maximum([])).toEqual([])
        expect(flags.maximum([12])).toEqual([12])
        expect(flags.maximum([45])).toEqual([45, 12])
        expect(flags.maximum([78])).toEqual([78, 45, 12])
        expect(flags.maximum([99])).toEqual([])
    })

    test('minimum', () => {
        const flags = createArrayFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c', requires: ['b'] },
        ])

        expect(flags.minimum([])).toEqual([])
        expect(flags.minimum([12])).toEqual([12])
        expect(flags.minimum([45])).toEqual([])
        expect(flags.minimum([12, 45])).toEqual([12, 45])
        expect(flags.minimum([12, 78])).toEqual([12])
        expect(flags.minimum([12, 45, 78])).toEqual([12, 45, 78])
        expect(flags.minimum([99])).toEqual([])
    })
})
