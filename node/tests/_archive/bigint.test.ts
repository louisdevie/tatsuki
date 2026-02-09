import { BigBitFlagSet } from '~'

const bigPowerOfTwo = 2n ** 100n


test('Iterate over a number', () => {
    const flags = new BigBitFlagSet()

    expect([...flags.iterate(0n)]).toEqual([])
    expect([...flags.iterate(1n)]).toEqual([1n])
    expect([...flags.iterate(2n)]).toEqual([2n])
    expect([...flags.iterate(3n)]).toEqual([1n, 2n])
    expect([...flags.iterate(11n)]).toEqual([1n, 2n, 8n])
    expect([...flags.iterate(100n)]).toEqual([4n, 32n, 64n])
})

test('Normalise to minimum', () => {
    const flags = new BigBitFlagSet()
    const flag1 = flags.flag(1n)
    const flag2 = flags.flag(2n, flag1)
    const flag4 = flags.flag(4n, flag1)
    const flag8 = flags.flag(8n, flag4)

    expect(flags.minimum(0n)).toEqual(0n)
    expect(flags.minimum(1n)).toEqual(1n)
    expect(flags.minimum(2n)).toEqual(0n)
    expect(flags.minimum(3n)).toEqual(3n)
    expect(flags.minimum(11n)).toEqual(3n)
    expect(flags.minimum(13n)).toEqual(13n)
    expect(flags.minimum(17n)).toEqual(1n)
})

test('Normalise to maximum', () => {
    const flags = new BigBitFlagSet()
    const flag1 = flags.flag(1n)
    const flag2 = flags.flag(2n, flag1)
    const flag4 = flags.flag(4n, flag1)
    const flag8 = flags.flag(8n, flag4)

    expect(flags.maximum(0n)).toEqual(0n)
    expect(flags.maximum(1n)).toEqual(1n)
    expect(flags.maximum(2n)).toEqual(3n)
    expect(flags.maximum(3n)).toEqual(3n)
    expect(flags.maximum(11n)).toEqual(15n)
    expect(flags.maximum(13n)).toEqual(13n)
    expect(flags.maximum(17n)).toEqual(1n)
})

test('Add to bigint', () => {
    const flags = new BigBitFlagSet()
    const flag2 = flags.flag(2n)
    const flag4 = flags.flag(4n)
    const flags2And4 = flags.flag(flag2, flag4)
    const flag100 = flags.flag(bigPowerOfTwo)

    expect(flag2.addTo(1n)).toEqual(3n)
    expect(flag4.addTo(1n)).toEqual(5n)
    expect(flags2And4.addTo(1n)).toEqual(7n)
    expect(flag100.addTo(1n)).toEqual(bigPowerOfTwo + 1n)
    expect(flag2.addTo(bigPowerOfTwo)).toEqual(bigPowerOfTwo + 2n)
})

test('Remove from bigint', () => {
    const flags = new BigBitFlagSet()
    const flag1 = flags.flag(1n)
    const flag2 = flags.flag(2n)
    const flag4 = flags.flag(4n, flag1)
    const flag100 = flags.flag(bigPowerOfTwo)

    expect(flag1.removeFrom(7n)).toEqual(2n)
    expect(flag2.removeFrom(7n)).toEqual(5n)
    expect(flag4.removeFrom(7n)).toEqual(3n)
    expect(flag100.removeFrom(bigPowerOfTwo + 2n)).toEqual(2n)
    expect(flag100.removeFrom(2n)).toEqual(2n)
    expect(flag1.removeFrom(bigPowerOfTwo - 1n)).toEqual(bigPowerOfTwo - 6n)
})

test('Is in bigint', () => {
    const flags = new BigBitFlagSet()
    const flag1 = flags.flag(1n)
    const flag2 = flags.flag(2n)
    const flag4 = flags.flag(4n, flag1)

    expect(flag1.isIn(1n)).toBe(true)
    expect(flag2.isIn(3n)).toBe(true)
    expect(flag4.isIn(4n)).toBe(false)
    expect(flag4.isIn(5n)).toBe(true)
    expect(flag1.isIn(bigPowerOfTwo + 1n)).toBe(true)
})

test('Is abstract', () => {
    const flags = new BigBitFlagSet()
    const flag1 = flags.flag(1n)
    const flag2 = flags.flag(2n)
    const flags1And2 = flags.flag(flag1, flag2)
    const flag4 = flags.flag(4n, flags1And2)

    expect(flag1.isAbstract).toBe(false)
    expect(flag2.isAbstract).toBe(false)
    expect(flags1And2.isAbstract).toBe(true)
    expect(flag4.isAbstract).toBe(false)
})

test('Environment without bigint', async () => {
    const originalBigInt = globalThis.BigInt
    // @ts-ignore
    delete globalThis.BigInt
    let module: { BigBitFlagSet: typeof BigBitFlagSet }
    await jest.isolateModulesAsync(async () => {
        module = await import('@module')
    })

    expect(() => new module.BigBitFlagSet()).toThrow()

    globalThis.BigInt = originalBigInt
})
