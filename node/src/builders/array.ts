import { FlagDefinition } from '~/definitions'
import { ArrayFlagDefinitionFactory } from '~/definitions/array'
import { ArrayFlagSet } from '~/flagsets'

import {
    applyDeclarations,
    FlagWithValue,
    ListOfFlagsWithValue,
    NamedFlagWithValue,
} from './declarative'
import { FlagSetBuilder } from './generic'
import {
    DefineWithValueOrOrdinal,
    RequireParentsOrDefineWithValueOrOrdinal,
    WithValueOrOrdinal,
    WithValueOrOrdinalOrCompose,
} from './syntax'

export class ArrayFlagSetBuilder<T>
    implements
        WithValueOrOrdinalOrCompose<T, T[], ArrayFlagSet<T>>,
        RequireParentsOrDefineWithValueOrOrdinal<T, T[], ArrayFlagSet<T>>
{
    private readonly _underlying: FlagSetBuilder<T>

    public constructor() {
        this._underlying = new FlagSetBuilder()
    }

    public define(): WithValueOrOrdinal<T, T[], ArrayFlagSet<T>>
    public define(alias: string): WithValueOrOrdinalOrCompose<T, T[], ArrayFlagSet<T>>
    public define(alias?: string): WithValueOrOrdinalOrCompose<T, T[], ArrayFlagSet<T>> {
        this._underlying.define(alias)
        return this
    }

    public compose(...flags: string[]): DefineWithValueOrOrdinal<T, T[], ArrayFlagSet<T>> {
        this._underlying.compose(flags)
        return this
    }

    public withValue(value: T): RequireParentsOrDefineWithValueOrOrdinal<T, T[], ArrayFlagSet<T>> {
        this._underlying.withValue(value)
        return this
    }

    public withOrdinal(
        ordinal: number,
    ): RequireParentsOrDefineWithValueOrOrdinal<T, T[], ArrayFlagSet<T>> {
        throw new Error('Method not implemented.')
    }

    public requires(...flags: string[]): DefineWithValueOrOrdinal<T, T[], ArrayFlagSet<T>> {
        this._underlying.requires(flags)
        return this
    }

    public getResult(): ArrayFlagSet<T> {
        const graph = this._underlying.finish()
        const factory = new ArrayFlagDefinitionFactory<T>()
        return new ArrayFlagSet(graph.intoDictionary(factory))
    }
}

export function createArrayFlagSet<T>(declarations: FlagWithValue<T>[]): ArrayFlagSet<T>
export function createArrayFlagSet<T, D extends string>(
    declarations: Record<D, NamedFlagWithValue<T>>,
): ArrayFlagSet<T> & Record<D, FlagDefinition<T[]>>
export function createArrayFlagSet<T>(declarations: ListOfFlagsWithValue<T>): ArrayFlagSet<T> {
    const builder = new ArrayFlagSetBuilder<T>()
    applyDeclarations(declarations, builder)
    return builder.getResult()
}
