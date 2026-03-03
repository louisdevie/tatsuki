import { FlagDefinition, FlagsDictionary, printFlagValue } from '~/definitions'
import { InternalError } from '~/errors'

export interface PartialFlagInit<F> {
    alias?: string
    value?: F
    parents?: PartialFlagInit<F>[]
}

export function refByAlias(refs: string[]): PartialFlagInit<never>[] {
    return refs.map((ref) => ({ alias: ref }))
}

export interface FlagDefinitionFactory<F, S> {
    makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<F>[],
        results: Map<PartialFlagDefinition<F>, FlagDefinition<F, S>>,
    ): void
}

/**
 * A graph with {@link PartialFlagDefinition} vertices.
 */
export class FlagsGraph<F> {
    private readonly _definitions: PartialFlagDefinition<F>[]
    private readonly _aliasToDefinition: Map<string, PartialFlagDefinition<F>>
    private readonly _valueToDefinition: Map<F, PartialFlagDefinition<F>>

    public constructor() {
        this._definitions = []
        this._aliasToDefinition = new Map()
        this._valueToDefinition = new Map()
    }

    private add(pfd: PartialFlagDefinition<F>): void {
        this._definitions.push(pfd)
        if (pfd.alias !== undefined) {
            this._aliasToDefinition.set(pfd.alias, pfd)
        }
        if (pfd.value !== undefined) {
            this._valueToDefinition.set(pfd.value, pfd)
        }
    }

    /**
     * Search for a flag matching the alias or value of `init`. If no flag is found, a new
     * placeholder flag is created to make a forward reference.
     */
    private findOrAddPlaceholder(init: PartialFlagInit<F>): PartialFlagDefinition<F> {
        let pfd
        if (init.alias !== undefined) {
            pfd = this._aliasToDefinition.get(init.alias)
        }

        if (pfd === undefined) {
            pfd = new PartialFlagDefinition(true, init)
            this.add(pfd)
        }
        return pfd
    }

    /**
     * Add a new flag to the graph, or upgrade the existing definition.
     */
    public put(init: PartialFlagInit<F>): PartialFlagDefinition<F> {
        let pfd
        if (init.alias !== undefined) {
            pfd = this._aliasToDefinition.get(init.alias)
        }

        if (pfd === undefined) {
            pfd = new PartialFlagDefinition(false, init)
            this.add(pfd)
        } else {
            pfd.upgrade(init)
        }

        if (init.parents !== undefined) {
            for (const parentInit of init.parents) {
                const parentPfd = this.findOrAddPlaceholder(parentInit)
                pfd.addParent(parentPfd)
            }
        }

        return pfd
    }

    /**
     * A list of all definitions that are not placeholders.
     */
    public get definitions(): Iterable<PartialFlagDefinition<F>> {
        return this._definitions.filter((d) => !d.isPlaceholder)
    }

    /**
     * Return an array containing the definitions in topological order.
     * @throws CircularReferenceError when the graph can not be sorted because it contains a cycle.
     */
    private sortedDefinitions(): PartialFlagDefinition<F>[] {
        // work on a copy of the graph
        const remaining = new Map(this._definitions.map((pfd) => [pfd, new Set(pfd.parents)]))

        const sorted: PartialFlagDefinition<F>[] = []
        const start: PartialFlagDefinition<F>[] = []

        for (const pfd of [...remaining.keys()]) {
            const parents = remaining.get(pfd)!
            if (parents.size === 0) {
                start.push(pfd)
                remaining.delete(pfd)
            }
        }

        while (start.length > 0) {
            const current = start.pop()!
            sorted.push(current)
            for (const child of current.children) {
                const parents = remaining.get(child)!
                parents.delete(current)
                if (parents.size === 0) {
                    start.push(child)
                    remaining.delete(child)
                }
            }
        }

        return sorted
    }

    public intoDictionary<S>(factory: FlagDefinitionFactory<F, S>): FlagsDictionary<F, S> {
        const sortedPartialDefinitions = this.sortedDefinitions()

        const definitions = new Map<PartialFlagDefinition<F>, FlagDefinition<F, S>>()
        factory.makeDefinitions(sortedPartialDefinitions, definitions)

        const aliasToDefinition = new Map<string, FlagDefinition<F, S>>()
        for (const [alias, pfd] of this._aliasToDefinition.entries()) {
            const definition = definitions.get(pfd)
            if (definition === undefined) {
                throw new InternalError(`factory didn't provide any definition for ${pfd}`)
            }
            aliasToDefinition.set(alias, definition)
        }

        const valueToDefinition = new Map<F, FlagDefinition<F, S>>()
        for (const [value, pfd] of this._valueToDefinition.entries()) {
            const definition = definitions.get(pfd)
            if (definition === undefined) {
                throw new InternalError(`factory didn't provide any definition for ${pfd}`)
            }
            valueToDefinition.set(value, definition)
        }

        return new BiMapFlagsDictionary(aliasToDefinition, valueToDefinition)
    }
}

class BiMapFlagsDictionary<F, S> implements FlagsDictionary<F, S> {
    private readonly _aliasToDefinition: Map<string, FlagDefinition<F, S>>
    private readonly _valueToDefinition: Map<F, FlagDefinition<F, S>>

    public constructor(
        aliasToDefinition: Map<string, FlagDefinition<F, S>>,
        valueToDefinition: Map<F, FlagDefinition<F, S>>,
    ) {
        this._aliasToDefinition = aliasToDefinition
        this._valueToDefinition = valueToDefinition
    }

    public findByAlias(alias: string): FlagDefinition<F, S> | undefined {
        return this._aliasToDefinition.get(alias)
    }

    public findByValue(value: F): FlagDefinition<F, S> | undefined {
        return this._valueToDefinition.get(value)
    }
}

/**
 * A partial {@link FlagDefinition} used for building a flag graph.
 */
export class PartialFlagDefinition<F> {
    private readonly _alias: string | undefined
    private readonly _parents: Set<PartialFlagDefinition<F>>
    private readonly _children: Set<PartialFlagDefinition<F>>

    private _isPlaceholder: boolean
    private _value: F | undefined

    public constructor(isPlaceholder: boolean, init: PartialFlagInit<F>) {
        this._isPlaceholder = isPlaceholder
        this._alias = init.alias
        this._value = init.value
        this._parents = new Set()
        this._children = new Set()
    }

    /**
     * The alias of the flag, or `undefined` if no alias has been set yet.
     */
    public get alias(): string | undefined {
        return this._alias
    }

    /**
     * The value of the flag, or `undefined` if no value has been set yet.
     */
    public get value(): F | undefined {
        return this._value
    }

    /**
     * Indicates that this flag has not been defined yet, but has been referenced by another flag.
     */
    public get isPlaceholder(): boolean {
        return this._isPlaceholder
    }

    /**
     * Upgrade a placeholder flag to an actual definition.
     */
    public upgrade(init: PartialFlagInit<F>): void {
        this._value = init.value
        this._isPlaceholder = false
    }

    /**
     * The list of all parent flags (including forward references).
     */
    public get parents(): Iterable<PartialFlagDefinition<F>> {
        return this._parents
    }

    /**
     * The list of all children flags.
     */
    public get children(): Iterable<PartialFlagDefinition<F>> {
        return this._children
    }

    /**
     * Creates a parent-child relationship between this flag and another.
     */
    public addParent(parentPfd: PartialFlagDefinition<F>): void {
        this._parents.add(parentPfd)
        parentPfd._children.add(this)
    }

    public toString(): string {
        if (this._alias !== undefined) {
            return '"' + this._alias + '"'
        } else if (this._value !== undefined) {
            return JSON.stringify(this._value)
        } else {
            return '[?]'
        }
    }
}
