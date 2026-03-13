import { describe, expect, test } from 'vitest'

import { CollectionFlagSet, createCollectionFlagSet } from '~'

function set<T>(...values: T[]): Set<T> {
    return new Set<T>(values)
}

describe(CollectionFlagSet, () => {
    test('none', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.none()).toEqual(set())
    })

    test('of', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.of()).toEqual(set())
        expect(flags.of('a')).toEqual(set('a'))
        expect(flags.of('x', 'y', 'z')).toEqual(set('x', 'y', 'z'))
    })

    test('named', () => {
        const flags = createCollectionFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b' },
            { value: 78, as: 'c' },
            { compose: ['a', 'b'], as: 'ab' },
        ])

        expect(flags.named()).toEqual(set())
        expect(flags.named('a')).toEqual(set(12))
        expect(flags.named('ab', 'c')).toEqual(set(12, 45, 78))
    })

    test('union', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.union(set(), set())).toEqual(set())
        expect(flags.union(set('A'), set())).toEqual(set('A'))
        expect(flags.union(set(), set('B'))).toEqual(set('B'))
        expect(flags.union(set('A'), set('B'))).toEqual(set('A', 'B'))
        expect(flags.union(set('A', 'B'), set('B', 'C'))).toEqual(set('A', 'B', 'C'))
    })

    test('difference', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.difference(set(), set())).toEqual(set())
        expect(flags.difference(set('A'), set())).toEqual(set('A'))
        expect(flags.difference(set('A', 'B'), set('B', 'C'))).toEqual(set('A'))
        expect(flags.difference(set('B', 'C'), set('A', 'B'))).toEqual(set('C'))
        expect(flags.difference(set('D'), set('A', 'E'))).toEqual(set('D'))
    })

    test('intersection', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.intersection(set(), set())).toEqual(set())
        expect(flags.intersection(set('A'), set())).toEqual(set())
        expect(flags.intersection(set('A'), set('B'))).toEqual(set())
        expect(flags.intersection(set('A'), set('A', 'B'))).toEqual(set('A'))
        expect(flags.intersection(set('A', 'B', 'D'), set('A', 'C'))).toEqual(set('A'))
        expect(flags.intersection(set('A', 'B', 'D'), set('A', 'B', 'C'))).toEqual(set('A', 'B'))
    })

    test('isSuperset', () => {
        const flags = createCollectionFlagSet<string>([])

        expect(flags.isSuperset(set(), set())).toBe(true)
        expect(flags.isSuperset(set('A', 'B'), set())).toBe(true)
        expect(flags.isSuperset(set('A', 'B'), set('A'))).toBe(true)
        expect(flags.isSuperset(set('A', 'B'), set('A', 'B'))).toBe(true)
        expect(flags.isSuperset(set(), set('A', 'B'))).toBe(false)
        expect(flags.isSuperset(set('C', 'D'), set('B'))).toBe(false)
    })

    test('hasAny', () => {
        const flags = createCollectionFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c' },
        ])

        expect(flags.hasAny(set(), set())).toBe(false)
        expect(flags.hasAny(set(12, 45, 78), set())).toBe(false)
        expect(flags.hasAny(set(12, 45, 78), set(12))).toBe(true)
        expect(flags.hasAny(set(12), set(12, 78))).toBe(true)
        expect(flags.hasAny(set(45, 78), set(45))).toBe(false)
    })

    test('hasAll', () => {
        const flags = createCollectionFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c' },
        ])

        expect(flags.hasAll(set(), set())).toBe(true)
        expect(flags.hasAll(set(12, 45, 78), set())).toBe(true)
        expect(flags.hasAll(set(12, 45, 78), set(12))).toBe(true)
        expect(flags.hasAll(set(12), set(12, 78))).toBe(false)
        expect(flags.hasAll(set(45, 78), set(45))).toBe(false)
    })

    test('enumerate', () => {
        const flags = createCollectionFlagSet<string>([])

        expect([...flags.enumerate(set())]).toEqual([])
        expect([...flags.enumerate(set('A'))]).toEqual(['A'])
        expect([...flags.enumerate(set('A', 'B', 'C'))]).toEqual(['A', 'B', 'C'])
    })

    test('maximum', () => {
        const flags = createCollectionFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c', requires: ['b'] },
        ])

        expect(flags.maximum(set())).toEqual(set())
        expect(flags.maximum(set(12))).toEqual(set(12))
        expect(flags.maximum(set(45))).toEqual(set(12, 45))
        expect(flags.maximum(set(78))).toEqual(set(12, 45, 78))
        expect(flags.maximum(set(99))).toEqual(set())
    })

    test('minimum', () => {
        const flags = createCollectionFlagSet([
            { value: 12, as: 'a' },
            { value: 45, as: 'b', requires: ['a'] },
            { value: 78, as: 'c', requires: ['b'] },
        ])

        expect(flags.minimum(set())).toEqual(set())
        expect(flags.minimum(set(12))).toEqual(set(12))
        expect(flags.minimum(set(45))).toEqual(set())
        expect(flags.minimum(set(12, 45))).toEqual(set(12, 45))
        expect(flags.minimum(set(12, 78))).toEqual(set(12))
        expect(flags.minimum(set(12, 45, 78))).toEqual(set(12, 45, 78))
        expect(flags.minimum(set(99))).toEqual(set())
    })
})
