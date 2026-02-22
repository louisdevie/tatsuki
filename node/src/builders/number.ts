import { BitFlagSet, FlagDefinition, FlagsDictionary } from '~'
import {
    DefineWithValueOrOrdinal,
    RequireParentsOrDefineWithValueOrOrdinal,
    WithValueOrOrdinal,
    WithValueOrOrdinalOrCompose,
} from './syntax'
import {
    applyDeclarationsWithValueOrOrdinal,
    FlagWithValueOrOrdinal,
    ListOfFlagsWithValueOrOrdinal,
    NamedFlagWithValueOrOrdinal,
} from './declarative'
import { BitFlagDefinition } from '../definitions'
import { FlagDefinitionFactory, GenericFlagSetBuilder, PartialDefinition } from './generic'

export class BitFlagSetBuilder
    implements
        WithValueOrOrdinalOrCompose<number, number, BitFlagSet>,
        RequireParentsOrDefineWithValueOrOrdinal<number, number, BitFlagSet>
{
    private readonly _underlying: GenericFlagSetBuilder<number, number>

    public constructor() {
        this._underlying = new GenericFlagSetBuilder(new BitFlagDefinitionFactory())
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

    public getDictionary(): FlagsDictionary<number, number> {
        return this._underlying.buildDictionary() as any
    }

    public getResult(): BitFlagSet {
        return new BitFlagSet(this.getDictionary())
    }
}

class BitFlagDefinitionFactory implements FlagDefinitionFactory<number, number> {
    public readonly supportsDefinitionsByOrdinal = true
    public readonly supportsDefinitionsByValue = true

    public precomputeTopDown(partialDefinition: PartialDefinition<number, number>): void {
        partialDefinition.additiveValues = 0
        partialDefinition.baseValues = 0
        if (partialDefinition.value !== undefined) {
            partialDefinition.additiveValues = partialDefinition.value
            partialDefinition.baseValues = partialDefinition.value
        }
        if (partialDefinition.parents !== undefined) {
            for (const parent of partialDefinition.parents.values()) {
                partialDefinition.additiveValues =
                    partialDefinition.additiveValues | (parent.additiveValues ?? 0)
                if (partialDefinition.value === undefined) {
                    partialDefinition.baseValues =
                        partialDefinition.baseValues | (parent.baseValues ?? 0)
                }
            }
        }
    }

    public precomputeBottomUp(partialDefinition: PartialDefinition<number, number>): void {
        partialDefinition.subtractiveValues = 0
        if (partialDefinition.value) {
            partialDefinition.subtractiveValues = partialDefinition.value
        }
        if (partialDefinition.children) {
            for (const child of partialDefinition.children.values()) {
                partialDefinition.subtractiveValues =
                    partialDefinition.subtractiveValues | (child.subtractiveValues ?? 0)
            }
        }
    }

    public createFlagDefinition(
        partialDefinition: PartialDefinition<number, number>,
    ): FlagDefinition<number, number> {
        return new BitFlagDefinition(
            partialDefinition.baseValues ?? 0,
            partialDefinition.additiveValues ?? 0,
            partialDefinition.subtractiveValues ?? 0,
            partialDefinition.alias,
        )
    }
}

export function createBitFlagSet(declarations: FlagWithValueOrOrdinal<number>[]): BitFlagSet
export function createBitFlagSet<D extends string>(
    declarations: Record<D, NamedFlagWithValueOrOrdinal<number>>,
): BitFlagSet & Record<D, FlagDefinition<number, number>>
export function createBitFlagSet(declarations: ListOfFlagsWithValueOrOrdinal<number>): BitFlagSet {
    const builder = new BitFlagSetBuilder()
    applyDeclarationsWithValueOrOrdinal(declarations, builder)
    return builder.getResult()
}
