import type { FlagSet } from '.'
import { EnumerateFlags, useIterator } from '../enumeration'
import { ENV_SET } from '../env'
import { UnavailableFeatureError } from '../errors'

export class CollectionFlagSet<T> implements FlagSet<T, Set<T>> {
    /**
     * Creates a new empty flag set.
     *
     * @throws UnavailableFeatureError When this constructor is called in an
     *         environment that does not natively support {@link Set}s.
     */
    public constructor() {
        if (!ENV_SET.AVAILABLE) {
            throw new UnavailableFeatureError('Sets')
        }
    }

    public none(): Set<T> {
        return new Set()
    }

    public union(first: Set<T>, second: Set<T>): Set<T> {
        return ENV_SET.union.call(first, second) as Set<T>
    }

    public intersection(first: Set<T>, second: Set<T>): Set<T> {
        return ENV_SET.intersection.call(first, second) as Set<T>
    }

    public difference(first: Set<T>, second: Set<T>): Set<T> {
        return ENV_SET.difference.call(first, second) as Set<T>
    }

    public isSuperset(first: Set<T>, second: Set<T>): boolean {
        return ENV_SET.isSupersetOf.call(first, second)
    }

    public enumerate(flags: Set<T>): EnumerateFlags<T> {
        return flags
    }

    minimum(flags: Set<T>): Set<T> {
        throw new Error('Method not implemented.')
    }
    maximum(flags: Set<T>): Set<T> {
        throw new Error('Method not implemented.')
    }

    public getFlag(alias: string): FlagDefinition<number, number> | undefined {
        return this._dictionary.lookUp(alias)
    }
}
