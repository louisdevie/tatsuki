import type { BitFlagSet } from '../flagsets'

export interface SelectFlagSetType {
    useBitFlags(): DefineFlag<BitFlagSet>
}

export interface DefineFlag<T> {
    define(name: string): SetValueOrCompose<T>

    build(): T
}

export interface RequireParentsOrDefineFlag<T> extends DefineFlag<T> {
    requires(...flags: string[]): DefineFlag<T>
}

export interface SetValueOrCompose<T> {
    withValue(value: number): RequireParentsOrDefineFlag<T>

    compose(...flags: string[]): DefineFlag<T>
}
