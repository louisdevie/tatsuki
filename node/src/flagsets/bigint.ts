import type { FlagSet } from '.'
import { UnavailableFeatureError } from '../errors'
import { ENV_BI } from '../env'
import {
    BigBitFlagsIterator,
    EnumerateFlags,
    useIterator,
} from '../enumeration'

export class BigBitFlagSet implements FlagSet<bigint, bigint> {
    /**
     * Creates a new empty flag set.
     *
     * @throws UnavailableFeatureError When this constructor is called in an
     *         environment that does not natively support {@link BigInt}s.
     */
    public constructor() {
        if (!ENV_BI.AVAILABLE) {
            throw new UnavailableFeatureError('BigInts')
        }
    }

    minimum(flags: bigint): bigint {
        throw new Error('Method not implemented.')
    }

    maximum(flags: bigint): bigint {
        throw new Error('Method not implemented.')
    }

    public none(): bigint {
        return ENV_BI.ZERO
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

    public enumerate(flags: bigint): EnumerateFlags<bigint> {
        return useIterator(flags, BigBitFlagsIterator)
    }

    public getFlag(alias: string): FlagDefinition<number, number> | undefined {
        return this._dictionary.lookUp(alias)
    }
}
