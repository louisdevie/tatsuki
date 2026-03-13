import type { FlagSet } from '~'

export interface Root<F, S, R = FlagSet<F, S>> {
    /**
     * Build a flag set with the flags previously defined.
     */
    getResult(): R
}

// Syntax for builders that supports only definitions by value

export interface DefineWithValue<F, S, R = FlagSet<F, S>> extends Root<F, S, R> {
    /**
     * Define an anonymous flag.
     */
    define(): WithValue<F, S, R>

    /**
     * Define a named flag.
     * @param alias The name of the flag.
     */
    define(alias: string): WithValueOrCompose<F, S, R>
}

export interface WithValue<F, S, R> {
    /**
     * Set the value of this flag.
     * @param value The value for the flag.
     */
    withValue(value: F): RequireParentsOrDefineWithValue<F, S, R>
}

export interface WithValueOrCompose<F, S, R> extends WithValue<F, S, R> {
    /**
     * Define this flag as a composed flag.
     * @param flags The name of the flags in the group.
     */
    compose(...flags: string[]): DefineWithValue<F, S, R>
}

export interface RequireParentsOrDefineWithValue<F, S, R> extends DefineWithValue<F, S, R> {
    /**
     * Set the parents of this flag.
     * @param flags The names of the parent flags.
     */
    requires(...flags: string[]): DefineWithValue<F, S, R>
}

// Syntax for builders that supports only definitions by ordinal

export interface DefineWithOrdinal<S, R = FlagSet<number, S>> extends Root<number, S, R> {
    /**
     * Define an anonymous flag.
     */
    define(): WithOrdinal<S, R>

    /**
     * Define a named flag.
     * @param alias The name of the flag.
     */
    define(alias: string): WithOrdinalOrCompose<S, R>
}

export interface WithOrdinal<S, R> {
    /**
     * Set the value of this flag.
     * @param ordinal The number of the flag (starting at 1). A unique value
     *                will be assigned based on this number.
     */
    withOrdinal(ordinal: number): RequireParentsOrDefineWithOrdinal<S, R>
}

export interface WithOrdinalOrCompose<S, R> extends WithOrdinal<S, R> {
    /**
     * Define this flag as a composed flag.
     * @param flags The name of the flags in the group.
     */
    compose(...flags: string[]): DefineWithOrdinal<S, R>
}

export interface RequireParentsOrDefineWithOrdinal<S, R> extends DefineWithOrdinal<S, R> {
    /**
     * Set the parents of this flag.
     * @param flags The names of the parent flags.
     */
    requires(...flags: string[]): DefineWithOrdinal<S, R>
}

// Syntax for builders that supports definitions by value and ordinal

export interface DefineWithValueOrOrdinal<F, S, R = FlagSet<F, S>> extends Root<F, S, R> {
    /**
     * Define an anonymous flag.
     */
    define(): WithValueOrOrdinal<F, S, R>

    /**
     * Define a named flag.
     * @param alias The name of the flag.
     */
    define(alias: string): WithValueOrOrdinalOrCompose<F, S, R>
}

export interface WithValueOrOrdinal<F, S, R> {
    /**
     * Set the value of this flag.
     * @param value The value for the flag.
     */
    withValue(value: F): RequireParentsOrDefineWithValueOrOrdinal<F, S, R>

    /**
     * Set the value of this flag.
     * @param ordinal The number of the flag (starting at 1). A unique value
     *                will be assigned based on this number.
     */
    withOrdinal(ordinal: number): RequireParentsOrDefineWithValueOrOrdinal<F, S, R>
}

export interface WithValueOrOrdinalOrCompose<F, S, R> extends WithValueOrOrdinal<F, S, R> {
    /**
     * Define this flag as a composed flag.
     * @param flags The name of the flags in the group.
     */
    compose(...flags: string[]): DefineWithValueOrOrdinal<F, S, R>
}

export interface RequireParentsOrDefineWithValueOrOrdinal<F, S, R>
    extends DefineWithValueOrOrdinal<F, S, R> {
    /**
     * Set the parents of this flag.
     * @param flags The names of the parent flags.
     */
    requires(...flags: string[]): DefineWithValueOrOrdinal<F, S, R>
}
