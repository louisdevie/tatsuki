import { FlagDefinition, FlagsDictionary } from '~/definitions'
import { EnumerateFlags } from '~/enumeration'
import { ENV_SET } from '~/env'

import type { FlagSet } from '.'

export class CollectionFlagSet<T> implements FlagSet<T, Set<T>> {
    private readonly _dictionary: FlagsDictionary<T, Set<T>>

    public constructor(dictionary: FlagsDictionary<T, Set<T>>) {
        this._dictionary = dictionary
    }

    public none(): Set<T> {
        return new Set<T>()
    }

    public of(...values: T[]): Set<T> {
        return new Set(values)
    }

    public named(...aliases: string[]): Set<T> {
        const result = new Set<T>()
        for (const alias of aliases) {
            const definition = this.getFlag(alias)
            if (definition !== undefined) {
                for (const value of definition.values) {
                    result.add(value)
                }
            }
        }
        return result
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

    public hasAny(flags: Set<T>, required: Set<T>): boolean {
        let result = false
        for (const value of required) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = true
                break
            }
        }
        return result
    }

    public hasAll(flags: Set<T>, required: Set<T>): boolean {
        let result = true
        for (const value of required) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && !definition.isIn(flags)) {
                result = false
                break
            }
        }
        return result
    }

    public enumerate(flags: Set<T>): EnumerateFlags<T> {
        return flags
    }

    public maximum(flags: Set<T>): Set<T> {
        let result = new Set<T>()
        for (const value of flags) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public minimum(flags: Set<T>): Set<T> {
        let result = new Set<T>()
        for (const value of flags) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public getFlag(alias: string): FlagDefinition<Set<T>> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
