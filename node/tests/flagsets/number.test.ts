import { BitFlagSet } from '~'

describe(BitFlagSet, () => {
    test('none', () => {
        const flags = new BitFlagSet()

        expect(flags.none()).toEqual(0)
    })

    test('union', () => {
        const flags = new BitFlagSet()

        expect(flags.union(0, 0)).toEqual(0)
        expect(flags.union(1, 0)).toEqual(1)
        expect(flags.union(0, 2)).toEqual(2)
        expect(flags.union(1, 2)).toEqual(3)
        expect(flags.union(3, 6)).toEqual(7)
    })

    test('difference', () => {
        const flags = new BitFlagSet()

        expect(flags.difference(0, 0)).toEqual(0)
        expect(flags.difference(1, 0)).toEqual(1)
        expect(flags.difference(3, 6)).toEqual(1)
        expect(flags.difference(6, 3)).toEqual(4)
        expect(flags.difference(8, 17)).toEqual(8)
    })

    test('intersection', () => {
        const flags = new BitFlagSet()

        expect(flags.intersection(0, 0)).toEqual(0)
        expect(flags.intersection(1, 0)).toEqual(0)
        expect(flags.intersection(1, 2)).toEqual(0)
        expect(flags.intersection(1, 3)).toEqual(1)
        expect(flags.intersection(11, 5)).toEqual(1)
        expect(flags.intersection(11, 7)).toEqual(3)
    })

    test('isSuperset', () => {
        const flags = new BitFlagSet()

        expect(flags.isSuperset(0, 0)).toBe(true)
        expect(flags.isSuperset(3, 0)).toBe(true)
        expect(flags.isSuperset(3, 1)).toBe(true)
        expect(flags.isSuperset(3, 3)).toBe(true)
        expect(flags.isSuperset(0, 3)).toBe(false)
        expect(flags.isSuperset(8, 4)).toBe(false)
    })

    test('enumerate', () => {
        const flags = new BitFlagSet()

        expect([...flags.enumerate(0)]).toEqual([])
        expect([...flags.enumerate(1)]).toEqual([1])
        expect([...flags.enumerate(2)]).toEqual([2])
        expect([...flags.enumerate(3)]).toEqual([1, 2])
        expect([...flags.enumerate(11)]).toEqual([1, 2, 8])
        expect([...flags.enumerate(100)]).toEqual([4, 32, 64])
    })
})
