import type { FlagDefinition } from '.'
import { ReusedFlagAliasError, ReusedFlagValueError } from '../errors'

/**
 * A collection of {@link FlagDefinition}s.
 */
export interface FlagsDictionary<F, S> {
    /**
     * Search for a flag in the collection.
     * @param alias The alias of the flag.
     * @returns The corresponding definition, or `undefined` if there is no flag
     *          with this alias.
     */
    findByAlias(alias: string): FlagDefinition<F, S> | undefined
}

/**
 * Built-in dictionary implementation.
 * @internal
 */
export class GenericFlagsDictionary<F, S> implements FlagsDictionary<F, S> {
    private readonly _named: Map<string, FlagDefinition<F, S>>
    private readonly _anonymous: FlagDefinition<F, S>[]

    public constructor() {
        this._named = new Map()
        this._anonymous = []
    }

    public add(definition: FlagDefinition<F, S>): void {
        if (definition.alias === undefined) {
            this._anonymous.push(definition)
        } else {
            this._named.set(definition.alias, definition)
        }
    }

    /**
     * Search for a flag in the collection.
     * @param alias The alias of the flag.
     * @returns The corresponding definition, or `undefined` if there is no flag
     *          with this alias.
     */
    public findByAlias(alias: string): FlagDefinition<F, S> | undefined {
        return this._named.get(alias)
    }
}

/*
    public define(definition: FlagDefinition<F, S>) {
        for (const other of this._named.values()) {
            if (
                definition.alias !== undefined &&
                definition.alias === other.alias
            ) {
                throw new ReusedFlagAliasError(definition.alias)
            }
            if (definition.hasSameValue(other)) {
                throw new ReusedFlagValueError(definition, other)
            }
        }
        for (const other of this._anonymous) {
            if (definition.hasSameValue(other)) {
                throw new ReusedFlagValueError(definition, other)
            }
        }
 */
