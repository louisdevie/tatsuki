import { FlagDefinition, FlagsDictionary } from '~/definitions'
import { BigBitFlagsIterator, EnumerateFlags, useIterator } from '~/enumeration'
import { ENV_BI } from '~/env'

import type { FlagSet } from '.'

export class BigBitFlagSet implements FlagSet<bigint, bigint> {
    private readonly _dictionary: FlagsDictionary<bigint, bigint>

    public constructor(dictionary: FlagsDictionary<bigint, bigint>) {
        this._dictionary = dictionary
    }

    public none(): bigint {
        return ENV_BI.ZERO
    }

    public of(...values: bigint[]): bigint {
        return values.reduce((set, value) => set | value, ENV_BI.ZERO)
    }

    public named(...aliases: string[]): bigint {
        return aliases.reduce(
            (set, alias) => set | (this.getFlag(alias)?.values ?? ENV_BI.ZERO),
            ENV_BI.ZERO,
        )
    }

    public union(first: bigint, second: bigint): bigint {
        return first | second
    }

    public intersection(first: bigint, second: bigint): bigint {
        return first & second
    }

    public difference(first: bigint, second: bigint): bigint {
        return first & ~second
    }

    public isSuperset(first: bigint, second: bigint): boolean {
        return (first & second) == second
    }

    public hasAny(flags: bigint, required: bigint): boolean {
        return this.minimum(this.intersection(flags, required)) !== ENV_BI.ZERO
    }

    public hasAll(flags: bigint, required: bigint): boolean {
        return this.isSuperset(flags, this.maximum(required))
    }

    public enumerate(flags: bigint): EnumerateFlags<bigint> {
        return useIterator(flags, BigBitFlagsIterator)
    }

    public maximum(flags: bigint): bigint {
        let result = ENV_BI.ZERO
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public minimum(flags: bigint): bigint {
        let result = ENV_BI.ZERO
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public getFlag(alias: string): FlagDefinition<bigint> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
