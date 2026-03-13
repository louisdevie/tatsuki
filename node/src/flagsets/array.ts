import { FlagDefinition, FlagsDictionary } from '~/definitions'
import { EnumerateFlags } from '~/enumeration'

import type { FlagSet } from '.'

export class ArrayFlagSet<T> implements FlagSet<T, T[]> {
    private readonly _dictionary: FlagsDictionary<T, T[]>

    public constructor(dictionary: FlagsDictionary<T, T[]>) {
        this._dictionary = dictionary
    }

    public none(): T[] {
        return []
    }

    public of(...values: T[]): T[] {
        return values
    }

    public named(...aliases: string[]): T[] {
        const result: T[] = []
        for (const alias of aliases) {
            const definition = this.getFlag(alias)
            if (definition !== undefined) {
                for (const value of definition.values) {
                    if (!result.includes(value)) {
                        result.push(value)
                    }
                }
            }
        }
        return result
    }

    public union(first: T[], second: T[]): T[] {
        const unionArray: T[] = []
        for (const item of first) {
            if (!unionArray.includes(item)) {
                unionArray.push(item)
            }
        }
        for (const item of second) {
            if (!unionArray.includes(item)) {
                unionArray.push(item)
            }
        }
        return unionArray
    }

    public intersection(first: T[], second: T[]): T[] {
        const intersectionArray: T[] = []
        for (const item of first) {
            if (!intersectionArray.includes(item) && second.includes(item)) {
                intersectionArray.push(item)
            }
        }
        return intersectionArray
    }

    public difference(first: T[], second: T[]): T[] {
        const differenceArray: T[] = []
        for (const item of first) {
            if (!differenceArray.includes(item) && !second.includes(item)) {
                differenceArray.push(item)
            }
        }
        return differenceArray
    }

    public isSuperset(first: T[], second: T[]): boolean {
        for (const item of second) {
            if (!first.includes(item)) {
                return false
            }
        }
        return true
    }

    public hasAny(flags: T[], required: T[]): boolean {
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

    public hasAll(flags: T[], required: T[]): boolean {
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

    public enumerate(flags: T[]): EnumerateFlags<T> {
        return flags
    }

    public maximum(flags: T[]): T[] {
        let result: T[] = []
        for (const value of flags) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public minimum(flags: T[]): T[] {
        let result: T[] = []
        for (const value of flags) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = definition.addTo(result)
            }
        }
        return result
    }

    public getFlag(alias: string): FlagDefinition<T[]> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
