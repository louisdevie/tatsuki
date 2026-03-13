import { FlagDefinition, FlagDefinitionFactory, PartialFlagDefinition } from '.'

export class ArrayFlagDefinition<T> implements FlagDefinition<T[]> {
    private readonly _value: T | undefined
    private readonly _alias: string | undefined
    private readonly _parents: ArrayFlagDefinition<T>[]
    private readonly _children: ArrayFlagDefinition<T>[]

    public constructor(
        value: T | undefined,
        alias: string | undefined,
        parents: ArrayFlagDefinition<T>[],
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

    public get values(): T[] {
        const values: T[] = []
        if (this._value === undefined) {
            for (const parent of this._parents) {
                for (const parentValue of parent.values) {
                    if (!values.includes(parentValue)) {
                        values.push(parentValue)
                    }
                }
            }
        } else {
            if (!values.includes(this._value)) {
                values.push(this._value)
            }
        }
        return values
    }

    public isIn(set: T[]): boolean {
        let result = this._value === undefined || set.includes(this._value)
        for (const parent of this._parents) {
            result &&= parent.isIn(set)
        }
        return result
    }

    public addTo(set: T[]): T[] {
        const result: T[] = [...set]
        if (this._value !== undefined) {
            if (!result.includes(this._value)) {
                result.push(this._value)
            }
        }
        for (const parent of this._parents) {
            parent.addToMutable(result)
        }
        return result
    }

    private addToMutable(set: T[]): void {
        if (this._value !== undefined) {
            if (!set.includes(this._value)) {
                set.push(this._value)
            }
        }
        for (const parent of this._parents) {
            parent.addToMutable(set)
        }
    }

    public removeFrom(set: T[]): T[] {
        const result: T[] = [...set]
        if (this._value !== undefined) {
            const i = result.indexOf(this._value)
            if (i >= 0) {
                result.splice(i, 1)
            }
        }
        for (const parent of this._parents) {
            parent.removeFromMutable(result)
        }
        return result
    }

    public removeFromMutable(set: T[]): void {
        if (this._value !== undefined) {
            const i = set.indexOf(this._value)
            if (i >= 0) {
                set.splice(i, 1)
            }
        }
        for (const parent of this._parents) {
            parent.removeFromMutable(set)
        }
    }
}

export class ArrayFlagDefinitionFactory<T> implements FlagDefinitionFactory<T, T[]> {
    public makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<T>[],
        results: Map<PartialFlagDefinition<T>, FlagDefinition<T[]>>,
    ): void {
        for (const pfd of sortedPartialDefinitions) {
            const parents: ArrayFlagDefinition<T>[] = []
            for (const parentPfd of pfd.parents) {
                parents.push(results.get(parentPfd) as ArrayFlagDefinition<T>)
            }

            results.set(pfd, new ArrayFlagDefinition(pfd.value, pfd.alias, parents))
        }
    }
}
