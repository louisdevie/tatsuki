import { CollectionFlagSet } from '~/flagsets'
import {
    applyDeclarations,
    FlagWithValue,
    FlagWithValueOrOrdinal,
    ListOfFlagsWithValue,
    ListOfFlagsWithValueOrOrdinal,
    NamedFlagWithValue,
    NamedFlagWithValueOrOrdinal,
} from './declarative'
import { FlagDefinition } from '~/definitions'
import {
    DefineWithValueOrOrdinal,
    RequireParentsOrDefineWithValueOrOrdinal,
    WithValueOrOrdinal,
    WithValueOrOrdinalOrCompose,
} from './syntax'
import { FlagSetBuilder } from './generic'
import { CollectionFlagDefinitionFactory } from '~/definitions/collection'

export class CollectionFlagSetBuilder<T>
    implements
        WithValueOrOrdinalOrCompose<T, Set<T>, CollectionFlagSet<T>>,
        RequireParentsOrDefineWithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>>
{
    private readonly _underlying: FlagSetBuilder<T>

    public constructor() {
        this._underlying = new FlagSetBuilder()
    }

    public define(): WithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>>
    public define(alias: string): WithValueOrOrdinalOrCompose<T, Set<T>, CollectionFlagSet<T>>
    public define(alias?: string): WithValueOrOrdinalOrCompose<T, Set<T>, CollectionFlagSet<T>> {
        this._underlying.define(alias)
        return this
    }

    public compose(...flags: string[]): DefineWithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>> {
        this._underlying.compose(flags)
        return this
    }

    public withValue(
        value: T,
    ): RequireParentsOrDefineWithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>> {
        this._underlying.withValue(value)
        return this
    }

    public withOrdinal(
        ordinal: number,
    ): RequireParentsOrDefineWithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>> {
        throw new Error('Method not implemented.')
    }

    public requires(...flags: string[]): DefineWithValueOrOrdinal<T, Set<T>, CollectionFlagSet<T>> {
        this._underlying.requires(flags)
        return this
    }

    public getResult(): CollectionFlagSet<T> {
        const graph = this._underlying.finish()
        const factory = new CollectionFlagDefinitionFactory<T>()
        return new CollectionFlagSet(graph.intoDictionary(factory))
    }
}

export function createCollectionFlagSet<T>(declarations: FlagWithValue<T>[]): CollectionFlagSet<T>
export function createCollectionFlagSet<T, D extends string>(
    declarations: Record<D, NamedFlagWithValue<T>>,
): CollectionFlagSet<T> & Record<D, FlagDefinition<Set<T>>>
export function createCollectionFlagSet<T>(
    declarations: ListOfFlagsWithValue<T>,
): CollectionFlagSet<T> {
    const builder = new CollectionFlagSetBuilder<T>()
    applyDeclarations(declarations, builder)
    return builder.getResult()
}
