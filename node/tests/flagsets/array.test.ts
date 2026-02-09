import { ArrayFlagSet } from '~'

describe(ArrayFlagSet, () => {
    test('none', () => {
        const flags = new ArrayFlagSet<string>()

        expect(flags.none()).toEqual([])
    })

    test('union', () => {
        const flags = new ArrayFlagSet<string>()

        expect(flags.union([], [])).toEqual([])
        expect(flags.union(['A'], [])).toEqual(['A'])
        expect(flags.union([], ['B'])).toEqual(['B'])
        expect(flags.union(['A'], ['B'])).toEqual(['A', 'B'])
        expect(flags.union(['A', 'B'], ['B', 'C'])).toEqual(['A', 'B', 'C'])
    })

    test('difference', () => {
        const flags = new ArrayFlagSet<string>()

        expect(flags.difference([], [])).toEqual([])
        expect(flags.difference(['A'], [])).toEqual(['A'])
        expect(flags.difference(['A', 'B'], ['B', 'C'])).toEqual(['A'])
        expect(flags.difference(['B', 'C'], ['A', 'B'])).toEqual(['C'])
        expect(flags.difference(['D'], ['A', 'E'])).toEqual(['D'])
    })

    test('intersection', () => {
        const flags = new ArrayFlagSet<string>()

        expect(flags.intersection([], [])).toEqual([])
        expect(flags.intersection(['A'], [])).toEqual([])
        expect(flags.intersection(['A'], ['B'])).toEqual([])
        expect(flags.intersection(['A'], ['A', 'B'])).toEqual(['A'])
        expect(flags.intersection(['A', 'B', 'D'], ['A', 'C'])).toEqual(['A'])
        expect(flags.intersection(['A', 'B', 'D'], ['A', 'B', 'C'])).toEqual([
            'A',
            'B',
        ])
    })

    test('isSuperset', () => {
        const flags = new ArrayFlagSet<string>()

        expect(flags.isSuperset([], [])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], [])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], ['A'])).toBe(true)
        expect(flags.isSuperset(['A', 'B'], ['A', 'B'])).toBe(true)
        expect(flags.isSuperset([], ['A', 'B'])).toBe(false)
        expect(flags.isSuperset(['C', 'D'], ['B'])).toBe(false)
    })

    test('enumerate', () => {
        const flags = new ArrayFlagSet<string>()

        expect([...flags.enumerate([])]).toEqual([])
        expect([...flags.enumerate(['A'])]).toEqual(['A'])
        expect([...flags.enumerate(['A', 'B', 'C'])]).toEqual(['A', 'B', 'C'])
    })
})
