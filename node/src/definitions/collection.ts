import { FlagDefinition, FlagDefinitionFactory, PartialFlagDefinition } from '.'
import { ENV_SET } from '~/env'

export class CollectionFlagDefinition<T> implements FlagDefinition<Set<T>> {
    private readonly _value: T | undefined
    private readonly _alias: string | undefined
    private readonly _parents: CollectionFlagDefinition<T>[]
    private readonly _children: CollectionFlagDefinition<T>[]

    public constructor(
        value: T | undefined,
        alias: string | undefined,
        parents: CollectionFlagDefinition<T>[],
    ) {
        this._value = value
        this._alias = alias
        this._parents = parents
        this._children = []

        for (const parent of this._parents) {
            parent._children.push(this)
        }
    }

    public get alias(): string | undefined {
        return this._alias
    }

    public get values(): Set<T> {
        let values = new Set<T>()
        if (this._value === undefined) {
            for (const parent of this._parents) {
                values = ENV_SET.union.call(values, parent.values) as Set<T>
            }
        } else {
            values.add(this._value)
        }
        return values
    }

    public isIn(set: Set<T>): boolean {
        let result = this._value === undefined || set.has(this._value)
        for (const parent of this._parents) {
            result &&= parent.isIn(set)
        }
        return result
    }

    public addTo(set: Set<T>): Set<T> {
        const result = new Set(set)
        if (this._value !== undefined) {
            result.add(this._value)
        }
        for (const parent of this._parents) {
            parent.addToMutable(result)
        }
        return result
    }

    private addToMutable(set: Set<T>): void {
        if (this._value !== undefined) {
            set.add(this._value)
        }
        for (const parent of this._parents) {
            parent.addToMutable(set)
        }
    }

    public removeFrom(set: Set<T>): Set<T> {
        const result = new Set(set)
        if (this._value !== undefined) {
            result.delete(this._value)
        }
        for (const parent of this._parents) {
            parent.removeFromMutable(result)
        }
        return result
    }

    public removeFromMutable(set: Set<T>): void {
        if (this._value !== undefined) {
            set.delete(this._value)
        }
        for (const child of this._children) {
            child.removeFromMutable(set)
        }
    }
}

export class CollectionFlagDefinitionFactory<T> implements FlagDefinitionFactory<T, Set<T>> {
    public makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<T>[],
        results: Map<PartialFlagDefinition<T>, FlagDefinition<Set<T>>>,
    ): void {
        for (const pfd of sortedPartialDefinitions) {
            const parents: CollectionFlagDefinition<T>[] = []
            for (const parentPfd of pfd.parents) {
                parents.push(results.get(parentPfd) as CollectionFlagDefinition<T>)
            }

            results.set(pfd, new CollectionFlagDefinition(pfd.value, pfd.alias, parents))
        }
    }
}
