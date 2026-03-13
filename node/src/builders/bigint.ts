import { BigBitFlagDefinitionFactory, FlagDefinition } from '~/definitions'
import { BigBitFlagSet } from '~/flagsets'

import {
    applyDeclarations,
    FlagWithValueOrOrdinal,
    ListOfFlagsWithValueOrOrdinal,
    NamedFlagWithValueOrOrdinal,
} from './declarative'
import { FlagSetBuilder } from './generic'
import {
    DefineWithValueOrOrdinal,
    RequireParentsOrDefineWithValueOrOrdinal,
    WithValueOrOrdinal,
    WithValueOrOrdinalOrCompose,
} from './syntax'

export class BigBitFlagSetBuilder
    implements
        WithValueOrOrdinalOrCompose<bigint, bigint, BigBitFlagSet>,
        RequireParentsOrDefineWithValueOrOrdinal<bigint, bigint, BigBitFlagSet>
{
    private readonly _underlying: FlagSetBuilder<bigint>

    public constructor() {
        this._underlying = new FlagSetBuilder()
    }

    public define(): WithValueOrOrdinal<bigint, bigint, BigBitFlagSet>
    public define(alias: string): WithValueOrOrdinalOrCompose<bigint, bigint, BigBitFlagSet>
    public define(alias?: string): WithValueOrOrdinalOrCompose<bigint, bigint, BigBitFlagSet> {
        this._underlying.define(alias)
        return this
    }

    public compose(...flags: string[]): DefineWithValueOrOrdinal<bigint, bigint, BigBitFlagSet> {
        this._underlying.compose(flags)
        return this
    }

    public withValue(
        value: bigint,
    ): RequireParentsOrDefineWithValueOrOrdinal<bigint, bigint, BigBitFlagSet> {
        this._underlying.withValue(value)
        return this
    }

    public withOrdinal(
        ordinal: number,
    ): RequireParentsOrDefineWithValueOrOrdinal<bigint, bigint, BigBitFlagSet> {
        throw new Error('Method not implemented.')
    }

    public requires(...flags: string[]): DefineWithValueOrOrdinal<bigint, bigint, BigBitFlagSet> {
        this._underlying.requires(flags)
        return this
    }

    public getResult(): BigBitFlagSet {
        const graph = this._underlying.finish()
        const factory = new BigBitFlagDefinitionFactory()
        return new BigBitFlagSet(graph.intoDictionary(factory))
    }
}

export function createBigBitFlagSet(declarations: FlagWithValueOrOrdinal<bigint>[]): BigBitFlagSet
export function createBigBitFlagSet<D extends string>(
    declarations: Record<D, NamedFlagWithValueOrOrdinal<bigint>>,
): BigBitFlagSet & Record<D, FlagDefinition<bigint>>
export function createBigBitFlagSet(
    declarations: ListOfFlagsWithValueOrOrdinal<bigint>,
): BigBitFlagSet {
    const builder = new BigBitFlagSetBuilder()
    applyDeclarations(declarations, builder)
    return builder.getResult()
}
