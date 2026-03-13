import { Base64BitFlagDefinitionFactory, FlagDefinition } from '~/definitions'
import { Base64BitFlagSet } from '~/flagsets'

import {
    applyDeclarations,
    FlagWithOrdinal,
    ListOfFlagsWithOrdinal,
    NamedFlagWithOrdinal,
} from './declarative'
import { FlagSetBuilder } from './generic'
import {
    DefineWithOrdinal,
    RequireParentsOrDefineWithOrdinal,
    WithOrdinal,
    WithOrdinalOrCompose,
} from './syntax'
import { InvalidOperationError } from '~/errors'

export class Base64BitFlagSetBuilder
    implements
        WithOrdinalOrCompose<string, Base64BitFlagSet>,
        RequireParentsOrDefineWithOrdinal<string, Base64BitFlagSet>
{
    private readonly _underlying: FlagSetBuilder<number>

    public constructor() {
        this._underlying = new FlagSetBuilder()
    }

    public define(): WithOrdinal<string, Base64BitFlagSet>
    public define(alias: string): WithOrdinalOrCompose<string, Base64BitFlagSet>
    public define(alias?: string): WithOrdinalOrCompose<string, Base64BitFlagSet> {
        this._underlying.define(alias)
        return this
    }

    public compose(...flags: string[]): DefineWithOrdinal<string, Base64BitFlagSet> {
        this._underlying.compose(flags)
        return this
    }

    public withValue(): never {
        throw new InvalidOperationError('withValue')
    }

    public withOrdinal(
        ordinal: number,
    ): RequireParentsOrDefineWithOrdinal<string, Base64BitFlagSet> {
        this._underlying.withValue(ordinal)
        return this
    }

    public requires(...flags: string[]): DefineWithOrdinal<string, Base64BitFlagSet> {
        this._underlying.requires(flags)
        return this
    }

    public getResult(): Base64BitFlagSet {
        const graph = this._underlying.finish()
        const factory = new Base64BitFlagDefinitionFactory()
        return new Base64BitFlagSet(graph.intoDictionary(factory))
    }
}

export function createBase64BitFlagSet(declarations: FlagWithOrdinal[]): Base64BitFlagSet
export function createBase64BitFlagSet<D extends string>(
    declarations: Record<D, NamedFlagWithOrdinal>,
): Base64BitFlagSet & Record<D, FlagDefinition<number>>
export function createBase64BitFlagSet(declarations: ListOfFlagsWithOrdinal): Base64BitFlagSet {
    const builder = new Base64BitFlagSetBuilder()
    applyDeclarations(declarations, builder)
    return builder.getResult()
}
