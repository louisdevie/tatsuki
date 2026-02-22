import { EnumerateFlags } from '../enumeration'
import { FlagDefinition } from '../definitions'

/**
 * Represents a group of flags of type `F` and the relationships between
 * them. It also provides methods to use `S` as a set of those flags.
 *
 * @typeParam F – The type of values in the set.
 * @typeParam S – The type to be used as a set.
 */
export interface FlagSet<F, S> {
    /**
     * Creates an empty set of flags.
     */
    none(): S

    /**
     * Creates a set of flags from a list of values.
     */
    of(...values: F[]): S

    /**
     * Creates a set of flags from a list of aliases.
     */
    named(...aliases: string[]): S

    /**
     * Computes the union of two sets of flags.
     *
     * @param first - The first set of flags.
     * @param second - The second set of flags.
     *
     * @returns A new set that contains the flags of both sets.
     */
    union(first: S, second: S): S

    /**
     * Computes the intersection of two set of flags.
     *
     * @param first - The first set of flags.
     * @param second - The second set of flags.
     *
     * @returns A new set that contains the flags that appear both in the first
     * set and the second set.
     */
    intersection(first: S, second: S): S

    /**
     * Computes the difference of two set of flags.
     *
     * @param first - The first set of flags.
     * @param second - The second set of flags (that will be subtracted from the
     * first).
     *
     * @returns A new set that contains the flags of the first set that do not
     * appear in the second.
     */
    difference(first: S, second: S): S

    /**
     * Checks whether the first set of flags is a superset of the second.
     *
     * @param first - The first set of flags.
     * @param second - The second set of flags.
     */
    isSuperset(first: S, second: S): boolean

    /**
     * Checks whether the first set of flags includes at least one of the flags
     * from the second set.
     *
     * A flag is considered to be part of the set only if all of its parents are
     * present too.
     *
     * @param flags - A set of flags.
     * @param required - The flags to search for in the first set.
     */
    hasAny(flags: S, required: S): boolean

    /**
     * Checks whether the first set of flags includes all the flags from the
     * second set.
     *
     * A flag is considered to be part of the set only if all of its parents are
     * present too.
     *
     * @param flags - A set of flags.
     * @param required - The flags to search for in the first set.
     */
    hasAll(flags: S, required: S): boolean

    /**
     * Returns an iterable over the individual flags in a set.
     *
     * @param flags - A set of flags.
     */
    enumerate(flags: S): EnumerateFlags<F>

    /**
     * Filters a flag set so that it only contains the flags that were declared
     * with the {@link flag} method. If a flags is missing some of its parents,
     * it will not be included in the result.
     *
     * @param flags The set of flags to filter.
     *
     * @returns A new set of flags.
     *
     * @see maximum
     */
    minimum(flags: S): S

    /**
     * Creates a copy of a flag set that will contain all the flags that were
     * declared with the {@link flag} method. If a flags is missing some of its
     * parents in the original set, they will be added to the result.
     *
     * @param flags The set of flags to filter.
     *
     * @returns A new set of flags.
     *
     * @see minimum
     */
    maximum(flags: S): S

    /**
     * Retrieve a flag definition from its alias.
     * @param alias The alias of the flag.
     * @returns The corresponding definition, or `undefined` if there is no flag
     *          with this alias.
     */
    getFlag(alias: string): FlagDefinition<F, S> | undefined
}

export { ArrayFlagSet } from './array'
export { Base64BitFlagSet } from './base64'
export { BigBitFlagSet } from './bigint'
export { CollectionFlagSet } from './collection'
export { BitFlagSet } from './number'
