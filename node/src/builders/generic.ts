import { InvalidOperationError } from '~/errors'
import { FlagsGraph, PartialFlagDefinition, PartialFlagInit, refByAlias } from '~/definitions'

export class FlagSetBuilder<F> {
    private readonly _graph: FlagsGraph<F>
    private _currentDefinition: PartialFlagInit<F> | undefined

    public constructor() {
        this._graph = new FlagsGraph()
        this._currentDefinition = undefined
    }

    public define(alias: string | undefined): void {
        if (
            this._currentDefinition !== undefined &&
            this._currentDefinition.value === undefined &&
            this._currentDefinition.parents === undefined
        ) {
            throw new InvalidOperationError('define')
        }
        this.finishCurrentDefinition()
        this._currentDefinition = { alias }
    }

    public compose(flags: string[]): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.alias === undefined ||
            this._currentDefinition.parents !== undefined
        ) {
            throw new InvalidOperationError('compose')
        }
        this._currentDefinition.parents = refByAlias([...new Set(flags)])
    }

    public withValue(value: F): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.value !== undefined ||
            this._currentDefinition.parents !== undefined
        ) {
            throw new InvalidOperationError('withValue')
        }
        this._currentDefinition.value = value
    }

    public requires(flags: string[]): void {
        if (
            this._currentDefinition === undefined ||
            this._currentDefinition.value === undefined ||
            this._currentDefinition.parents !== undefined
        ) {
            throw new InvalidOperationError('requires')
        }
        this._currentDefinition.parents = refByAlias([...new Set(flags)])
    }

    private finishCurrentDefinition() {
        if (this._currentDefinition !== undefined) {
            this._graph.put(this._currentDefinition)
        }
        this._currentDefinition = undefined
    }

    public finish(): FlagsGraph<F> {
        this.finishCurrentDefinition()
        return this._graph
    }
    /*
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
        return dict*/

    /*private displayPartialDefinition(definition: PartialDefinition<F, S>): string {
        if (definition.alias) {
            return '"' + definition.alias + '"'
        } else {
            // generate the definition and try to print its base value
            return printFlagValue(this._factory.createFlagDefinition(definition))
        }
    }*/
}
