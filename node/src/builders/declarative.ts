import type {
    DefineWithOrdinal,
    DefineWithValue,
    DefineWithValueOrOrdinal,
} from './syntax'

// Generic helper functions

/**
 * Copies the record keys into the 'as' property of the values and return an
 * array containing those values.
 */
function toDefinitionArray<D>(
    record: Record<string, D>,
): (D & { as: string })[] {
    return Object.keys(record).map((key) => ({ ...record[key], as: key }))
}

// Declarations for builders that supports only definitions by value

export type FlagWithValue<F> =
    | { value: F; as?: string; requires?: string[] }
    | { compose: string[]; as: string }

export type NamedFlagWithValue<F> =
    | { value: F; requires?: string[] }
    | { compose: string[] }

export type ListOfFlagsWithValue<F> =
    | FlagWithValue<F>[]
    | Record<string, NamedFlagWithValue<F>>

export function applyDeclarationsWithValue<F>(
    declarations: ListOfFlagsWithValue<F>,
    builder: DefineWithValue<F, unknown, unknown>,
) {
    const declarationsArray = Array.isArray(declarations)
        ? declarations
        : toDefinitionArray(declarations)

    for (const declaration of declarationsArray) {
        if ('compose' in declaration) {
            builder.define(declaration.as).compose(...declaration.compose)
        } else {
            // it doesn't matter if "as" is undefined,
            // we can always call withValue() on the returned value
            builder
                .define(declaration.as!)
                .withValue(declaration.value)
                .requires(...(declaration.requires ?? []))
        }
    }
}

// Declarations for builders that supports only definitions by ordinal

export type FlagWithOrdinal<F> =
    | { ordinal: number; as?: string; requires?: string[] }
    | { compose: string[]; as: string }

export type NamedFlagWithOrdinal<F> =
    | { ordinal: number; requires?: string[] }
    | { compose: string[] }

export type ListOfFlagsWithOrdinal<F> =
    | FlagWithOrdinal<F>[]
    | Record<string, NamedFlagWithOrdinal<F>>

export function applyDeclarationsWithOrdinal<F>(
    declarations: ListOfFlagsWithOrdinal<F>,
    builder: DefineWithOrdinal<F, unknown, unknown>,
) {
    const declarationsArray = Array.isArray(declarations)
        ? declarations
        : toDefinitionArray(declarations)

    for (const declaration of declarationsArray) {
        if ('compose' in declaration) {
            builder.define(declaration.as).compose(...declaration.compose)
        } else {
            // it doesn't matter if "as" is undefined,
            // we can always call withOrdinal() on the returned value
            builder
                .define(declaration.as!)
                .withOrdinal(declaration.ordinal)
                .requires(...(declaration.requires ?? []))
        }
    }
}

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

export function applyDeclarationsWithValueOrOrdinal<F>(
    declarations: ListOfFlagsWithValueOrOrdinal<F>,
    builder: DefineWithValueOrOrdinal<F, unknown, unknown>,
) {
    const declarationsArray = Array.isArray(declarations)
        ? declarations
        : toDefinitionArray(declarations)

    for (const declaration of declarationsArray) {
        if ('compose' in declaration) {
            builder.define(declaration.as).compose(...declaration.compose)
        } else if ('ordinal' in declaration) {
            builder
                .define(declaration.as!) // see note above
                .withOrdinal(declaration.ordinal)
                .requires(...(declaration.requires ?? []))
        } else {
            builder
                .define(declaration.as!) // see note above
                .withValue(declaration.value)
                .requires(...(declaration.requires ?? []))
        }
    }
}
