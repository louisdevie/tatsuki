import { NumberBitflagSet, InvalidBitflagValueError } from '@module'

test('Not powers of two', () => {
    const flags = new BitFlagSet()
    expect(() => flags.flag(0)).toThrow(InvalidBitFlagValueError)
    expect(() => flags.flag(11)).toThrow(InvalidBitFlagValueError)
})

test('Normalise to minimum', () => {
    const flags = new BitFlagSet()
    const flag1 = flags.flag(1)
    const flag2 = flags.flag(2, flag1)
    const flag4 = flags.flag(4, flag1)
    const flag8 = flags.flag(8, flag4)

    expect(flags.minimum(0)).toEqual(0)
    expect(flags.minimum(1)).toEqual(1)
    expect(flags.minimum(2)).toEqual(0)
    expect(flags.minimum(3)).toEqual(3)
    expect(flags.minimum(11)).toEqual(3)
    expect(flags.minimum(13)).toEqual(13)
    expect(flags.minimum(17)).toEqual(1)
})

test('Normalise to maximum', () => {
    const flags = new BitFlagSet()
    const flag1 = flags.flag(1)
    const flag2 = flags.flag(2, flag1)
    const flag4 = flags.flag(4, flag1)
    const flag8 = flags.flag(8, flag4)

    expect(flags.maximum(0)).toEqual(0)
    expect(flags.maximum(1)).toEqual(1)
    expect(flags.maximum(2)).toEqual(3)
    expect(flags.maximum(3)).toEqual(3)
    expect(flags.maximum(11)).toEqual(15)
    expect(flags.maximum(13)).toEqual(13)
    expect(flags.maximum(17)).toEqual(1)
})
