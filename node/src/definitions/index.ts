export { FlagsDictionary } from './dictionary'
export { BitFlagDefinition } from './number'

export interface FlagDefinition<F, S> {
    /**
     * The alias of the flag.
     */
    readonly alias: string | undefined

    readonly values: S

    hasSameValue(other: FlagDefinition<F, S>): boolean
}

export const valueToString = Symbol()

export function printFlagValue(flag: FlagDefinition<unknown, unknown>): string {
    if (valueToString in flag) {
        return (flag[valueToString] as Function)()
    } else {
        return String(flag.values)
    }
}
