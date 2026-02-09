import type { FlagSet } from '.'
import { BitFlagsIterator, EnumerateFlags, useIterator } from '../enumeration'

export class BitFlagSet implements FlagSet<number, number> {
    public none(): number {
        return 0
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

    public enumerate(flags: number): EnumerateFlags<number> {
        return useIterator(flags, BitFlagsIterator)
    }

    public maximum(flags: number): number {
        return 0
    }

    public minimum(flags: number): number {
        return 0
    }
}
