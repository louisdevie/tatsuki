import type { DefineWithValueOrOrdinal } from './syntax'

// Declarations for builders that supports only definitions by value

export type FlagWithValue<F> =
    | { value: F; as?: string; requires?: string[] }
    | { compose: string[]; as: string }

export type NamedFlagWithValue<F> = { value: F; requires?: string[] } | { compose: string[] }

export type ListOfFlagsWithValue<F> = FlagWithValue<F>[] | Record<string, NamedFlagWithValue<F>>

// Declarations for builders that supports only definitions by ordinal

export type FlagWithOrdinal =
    | { ordinal: number; as?: string; requires?: string[] }
    | { compose: string[]; as: string }

export type NamedFlagWithOrdinal = { ordinal: number; requires?: string[] } | { compose: string[] }

export type ListOfFlagsWithOrdinal = FlagWithOrdinal[] | Record<string, NamedFlagWithOrdinal>

// Declarations for builders that supports definitions by value and ordinal

export type FlagWithValueOrOrdinal<F> =
    | { value: F; as?: string; requires?: string[] }
    | { ordinal: number; as?: string; requires?: string[] }
    | { compose: string[]; as: string }

export type NamedFlagWithValueOrOrdinal<F> =
    | { value: F; requires?: string[] }
    | { ordinal: number; requires?: string[] }
    | { compose: string[] }

export type ListOfFlagsWithValueOrOrdinal<F> =
    | FlagWithValueOrOrdinal<F>[]
    | Record<string, NamedFlagWithValueOrOrdinal<F>>

// Helper function

export interface AnyBuilder<F> {
    define(alias: string | undefined): unknown
    compose(...flags: string[]): unknown
    withOrdinal(ordinal: number): unknown
    withValue(value: F): unknown
    requires(...flags: string[]): unknown
}

export function applyDeclarations<F>(
    declarations: ListOfFlagsWithValueOrOrdinal<F>,
    builder: AnyBuilder<F>,
) {
    let declarationsArray: FlagWithValueOrOrdinal<F>[]
    if (Array.isArray(declarations)) {
        declarationsArray = declarations
    } else {
        declarationsArray = Object.keys(declarations).map((key): FlagWithValueOrOrdinal<F> => {
            return { ...declarations[key], as: key }
        })
    }

    for (const declaration of declarationsArray) {
        builder.define(declaration.as)
        if ('compose' in declaration) {
            builder.compose(...declaration.compose)
        } else {
            if ('ordinal' in declaration) {
                builder.withOrdinal(declaration.ordinal)
            } else {
                builder.withValue(declaration.value)
            }

            if (declaration.requires !== undefined) {
                builder.requires(...declaration.requires)
            }
        }
    }
}
