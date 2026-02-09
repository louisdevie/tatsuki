import type { FlagSet } from '.'
import { EnumerateFlags } from '../enumeration'

export class ArrayFlagSet<T> implements FlagSet<T, T[]> {
    public none(): T[] {
        return []
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

    public enumerate(flags: T[]): EnumerateFlags<T> {
        return flags
    }

    maximum(flags: T[]): T[] {
        throw new Error('Method not implemented.')
    }

    minimum(flags: T[]): T[] {
        throw new Error('Method not implemented.')
    }
}
