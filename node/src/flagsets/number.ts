import type { FlagSet } from '.'
import { BitFlagsIterator, EnumerateFlags, useIterator } from '~/enumeration'
import { FlagDefinition, FlagsDictionary } from '~/definitions'

export const BitFlags = {
    /**
     * Computes the union of two sets of bitflags.
     * Any bits that are set in either of the inputs will be set in the result.
     */
    union(first: number, second: number): number {
        return first | second
    },

    /**
     * Computes the intersection of two sets of bitflags.
     * Only bits that are set in both of the inputs will be set in the result.
     */
    intersection(first: number, second: number): number {
        return first & second
    },

    /**
     * Computes the difference between two sets of bitflags.
     * Only bits that are set in the first input and not set in the second will be set in the result.
     */
    difference(first: number, second: number): number {
        return first & ~second
    },

    /**
     * Tests if a set of bitflags is a superset of the other.
     * Return `true` if every bit that is set in the second input is also set in the first.
     */
    isSuperset(first: number, second: number): boolean {
        return (first & second) === second
    },

    /**
     * Returns an iterable over the individual bits that are set.
     */
    enumerate(flags: number): EnumerateFlags<number> {
        return useIterator(flags, BitFlagsIterator)
    },
}

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
        return aliases.reduce((set, alias) => set | (this.getFlag(alias)?.values ?? 0), 0)
    }

    public union(first: number, second: number): number {
        return BitFlags.union(first, second)
    }

    public intersection(first: number, second: number): number {
        return BitFlags.intersection(first, second)
    }

    public difference(first: number, second: number): number {
        return BitFlags.difference(first, second)
    }

    public isSuperset(first: number, second: number): boolean {
        return BitFlags.isSuperset(first, second)
    }

    public hasAny(flags: number, required: number): boolean {
        return this.minimum(this.intersection(flags, required)) !== 0
    }

    public hasAll(flags: number, required: number): boolean {
        return this.isSuperset(flags, this.maximum(required))
    }

    public enumerate(flags: number): EnumerateFlags<number> {
        return BitFlags.enumerate(flags)
    }

    public maximum(flags: number): number {
        let result = 0
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public minimum(flags: number): number {
        let result = 0
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public getFlag(alias: string): FlagDefinition<number> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
