import { InvalidOperationError, InvalidReferenceError } from '../errors'
import { FlagDefinition, FlagsDictionary } from '~'
import { printFlagValue } from '../definitions'
import { GenericFlagsDictionary } from '../definitions/dictionary'

export interface FlagDefinitionFactory<F, S> {
    readonly supportsDefinitionsByValue: boolean
    readonly supportsDefinitionsByOrdinal: boolean

    precomputeTopDown(partialDefinition: PartialDefinition<F, S>): void

    precomputeBottomUp(partialDefinition: PartialDefinition<F, S>): void

    createFlagDefinition(partialDefinition: PartialDefinition<F, S>): FlagDefinition<F, S>
}

export interface PartialDefinition<F, S> {
    alias?: string
    value?: F
    parentRefs?: Set<string>
    parents?: Set<PartialDefinition<F, S>>
    children?: Set<PartialDefinition<F, S>>
    baseValues?: S
    additiveValues?: S
    subtractiveValues?: S
}

function addRelationship<F, S>(
    parent: PartialDefinition<F, S>,
    child: PartialDefinition<F, S>,
): void {
    if (parent.children === undefined) {
        parent.children = new Set([child])
    } else {
        parent.children.add(child)
    }
    if (child.parents === undefined) {
        child.parents = new Set([parent])
    } else {
        child.parents.add(parent)
    }
}

export class GenericFlagSetBuilder<F, S> {
    private readonly _factory: FlagDefinitionFactory<F, S>
    private readonly _definitions: Set<PartialDefinition<F, S>>
    private _currentDefinition: PartialDefinition<F, S> | undefined

    public constructor(factory: FlagDefinitionFactory<F, S>) {
        this._factory = factory
        this._definitions = new Set()
        this._currentDefinition = undefined
    }

    private get canMoveOnToNextDefinition(): boolean {
        return (
            this._currentDefinition === undefined ||
            this._currentDefinition.value !== undefined ||
            this._currentDefinition.parentRefs !== undefined
        )
    }

    private createNewDefinition(alias: string | undefined): void {
        const def = { alias }
        this._definitions.add(def)
        this._currentDefinition = def
    }

    public define(alias: string | undefined): void {
        if (!this.canMoveOnToNextDefinition) {
            throw new InvalidOperationError('define')
        }
        this.createNewDefinition(alias)
    }

    public compose(flags: string[]): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.alias === undefined ||
            this._currentDefinition.parentRefs !== undefined
        ) {
            throw new InvalidOperationError('compose')
        }
        this._currentDefinition.parentRefs = new Set(flags)
    }

    public withValue(value: F): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.value !== undefined ||
            this._currentDefinition.parentRefs !== undefined
        ) {
            throw new InvalidOperationError('withValue')
        }
        this._currentDefinition.value = value
    }

    public requires(flags: string[]): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.value === undefined ||
            this._currentDefinition.parentRefs !== undefined
        ) {
            throw new InvalidOperationError('requires')
        }
        this._currentDefinition.parentRefs = new Set(flags)
    }

    public buildDictionary(): FlagsDictionary<F, S> {
        // this array will contain the nodes of the graph, in topological order
        const sorted: PartialDefinition<F, S>[] = []

        const startNodes: PartialDefinition<F, S>[] = []
        for (const n of this._definitions) {
            if (n.parentRefs === undefined || n.parentRefs.size === 0) {
                startNodes.push(n)
            }
        }

        // Kahn's algorithm and resolution of flag parentRef at the same time
        while (startNodes.length > 0) {
            const n = startNodes.pop()!
            sorted.push(n)
            for (const m of this._definitions) {
                // if m is a child of n
                if (
                    m.parentRefs !== undefined &&
                    n.alias !== undefined &&
                    m.parentRefs.has(n.alias)
                ) {
                    // remove this edge from the parentRefs and create the relationship
                    m.parentRefs.delete(n.alias)
                    addRelationship(n, m)
                    // if m has no other parents, add it to the start nodes
                    if (m.parentRefs.size === 0) {
                        startNodes.push(m)
                    }
                }
            }
        }

        // check for remaining parent refs
        for (const n of this._definitions) {
            if (n.parentRefs !== undefined && n.parentRefs.size > 0) {
                throw new InvalidReferenceError(
                    [...n.parentRefs.entries()][0][0],
                    this.displayPartialDefinition(n),
                )
            }
        }

        const dict = new GenericFlagsDictionary<F, S>()
        for (let i = 0; i < sorted.length; i++) {
            this._factory.precomputeTopDown(sorted[i])
        }
        for (let i = sorted.length - 1; i >= 0; i--) {
            this._factory.precomputeBottomUp(sorted[i])
            dict.add(this._factory.createFlagDefinition(sorted[i]))
        }
        return dict
    }

    private displayPartialDefinition(definition: PartialDefinition<F, S>): string {
        if (definition.alias) {
            return '"' + definition.alias + '"'
        } else {
            // generate the definition and try to print its base value
            return printFlagValue(this._factory.createFlagDefinition(definition))
        }
    }
}
