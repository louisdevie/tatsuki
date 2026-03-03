import {
    DefineWithValueOrOrdinal,
    RequireParentsOrDefineWithValueOrOrdinal,
    WithValueOrOrdinal,
    WithValueOrOrdinalOrCompose,
} from './syntax'
import {
    applyDeclarations,
    FlagWithValueOrOrdinal,
    ListOfFlagsWithValueOrOrdinal,
    NamedFlagWithValueOrOrdinal,
} from './declarative'
import { BitFlagDefinitionFactory, FlagDefinition } from '~/definitions'
import { FlagSetBuilder } from './generic'
import { BitFlagSet } from '~/flagsets'

export class BitFlagSetBuilder
    implements
        WithValueOrOrdinalOrCompose<number, number, BitFlagSet>,
        RequireParentsOrDefineWithValueOrOrdinal<number, number, BitFlagSet>
{
    private readonly _underlying: FlagSetBuilder<number>

    public constructor() {
        this._underlying = new FlagSetBuilder()
    }

    public define(): WithValueOrOrdinal<number, number, BitFlagSet>
    public define(alias: string): WithValueOrOrdinalOrCompose<number, number, BitFlagSet>
    public define(alias?: string): WithValueOrOrdinalOrCompose<number, number, BitFlagSet> {
        this._underlying.define(alias)
        return this
    }

    public compose(...flags: string[]): DefineWithValueOrOrdinal<number, number, BitFlagSet> {
        this._underlying.compose(flags)
        return this
    }

    public withValue(
        value: number,
    ): RequireParentsOrDefineWithValueOrOrdinal<number, number, BitFlagSet> {
        this._underlying.withValue(value)
        return this
    }

    public withOrdinal(
        ordinal: number,
    ): RequireParentsOrDefineWithValueOrOrdinal<number, number, BitFlagSet> {
        throw new Error('Method not implemented.')
    }

    public requires(...flags: string[]): DefineWithValueOrOrdinal<number, number, BitFlagSet> {
        this._underlying.requires(flags)
        return this
    }

    public getResult(): BitFlagSet {
        const graph = this._underlying.finish()
        const definitions = graph.sortedDefinitions()
        const factory = new BitFlagDefinitionFactory()
        return new BitFlagSet(graph.intoDictionary(factory))
    }
}

export function createBitFlagSet(declarations: FlagWithValueOrOrdinal<number>[]): BitFlagSet
export function createBitFlagSet<D extends string>(
    declarations: Record<D, NamedFlagWithValueOrOrdinal<number>>,
): BitFlagSet & Record<D, FlagDefinition<number, number>>
export function createBitFlagSet(declarations: ListOfFlagsWithValueOrOrdinal<number>): BitFlagSet {
    const builder = new BitFlagSetBuilder()
    applyDeclarations(declarations, builder)
    return builder.getResult()
}
