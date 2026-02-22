import type { FlagSet } from '.'
import { BitFlagsIterator, EnumerateFlags, useIterator } from '../enumeration'
import { FlagDefinition, FlagsDictionary } from '../definitions'

export class BitFlagSet implements FlagSet<number, number> {
    private readonly _dictionary: FlagsDictionary<number, number>

    public constructor(dictionary: FlagsDictionary<number, number>) {
        this._dictionary = dictionary
    }

    public none(): number {
        return 0
    }

    public of(...values: number[]): number {
        return values.reduce((set, value) => set | value, 0)
    }

    public named(...aliases: string[]): number {
        return aliases.reduce(
            (set, alias) => set | (this.getFlag(alias)?.values ?? 0),
            0,
        )
    }

    public union(first: number, second: number): number {
        return first | second
    }

    public intersection(first: number, second: number): number {
        return first & second
    }

    public difference(first: number, second: number): number {
        return first & ~second
    }

    public isSuperset(first: number, second: number): boolean {
        return (first & second) == second
    }

    public hasAny(flags: number, required: number): boolean {
        return false
    }

    public hasAll(flags: number, required: number): boolean {
        return false
    }

    public enumerate(flags: number): EnumerateFlags<number> {
        return useIterator(flags, BitFlagsIterator)
    }

    public maximum(flags: number): number {
        return 0
    }

    public minimum(flags: number): number {
        return 0
    }

    public getFlag(alias: string): FlagDefinition<number, number> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
