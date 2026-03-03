export interface FlagsDictionary<F, S> {
    findByAlias(alias: string): FlagDefinition<F, S> | undefined

    findByValue(value: F): FlagDefinition<F, S> | undefined
}

export interface FlagDefinition<F, S> {
    /**
     * The alias of the flag.
     */
    readonly alias: string | undefined

    /**
     * A set containing the value of the flag, or multiple values if it is a composed flag.
     */
    readonly values: S

    /**
     * Test if this flag and all its parents are present in the set.
     * @param set A set of flags.
     * @returns `true` if the set includes this flags and its parents.
     */
    isIn(set: S): boolean

    /**
     * Add this flag and all its parents to the set.
     * @param set A set of flags.
     * @returns A new set of flags containing the flags from the `set`, this flag and its parents.
     */
    addTo(set: S): S

    /**
     * Removes this flag and all its children from the set.
     * @param set A set of flags.
     * @returns A new set of flags containing the flags from the `set` except this flag and its children.
     */
    removeFrom(set: S): S
}

export const valueToString = Symbol()

export function printFlagValue(flag: FlagDefinition<unknown, unknown>): string {
    if (valueToString in flag) {
        return (flag[valueToString] as Function)()
    } else {
        return String(flag.values)
    }
}
