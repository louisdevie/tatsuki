import { FlagDefinition, FlagsDictionary } from '~'
import { describe, expect, test } from 'vitest'
import { ReusedFlagAliasError, ReusedFlagValueError } from '../../src/errors'

class TestDefinition implements FlagDefinition<unknown, unknown> {
    private readonly _value: number

    public constructor(value: number) {
        this._value = value
    }

    public get values(): unknown {
        return this._value
    }

    public hasSameValue(other: FlagDefinition<unknown, unknown>): boolean {
        return other instanceof TestDefinition && this._value === other._value
    }
}

describe(FlagsDictionary, () => {
    test('define then look up', () => {
        const dict = new FlagsDictionary()
        const def = new TestDefinition(1)

        dict.define('test', def)

        expect(dict.findByAlias('test')).toBe(def)
        expect(dict.findByAlias('undefined')).toBe(undefined)
    })

    test("can't use the same alias twice", () => {
        const dict = new FlagsDictionary()

        dict.define('test', new TestDefinition(1))
        expect(() => dict.define('test', new TestDefinition(2))).toThrow(
            ReusedFlagAliasError,
        )
    })

    test("can't use the same value twice", () => {
        const dict = new FlagsDictionary()

        dict.define('test A', new TestDefinition(1))
        expect(() => dict.define('test B', new TestDefinition(1))).toThrow(
            ReusedFlagValueError,
        )
    })
})
