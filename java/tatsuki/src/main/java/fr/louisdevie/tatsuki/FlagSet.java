package fr.louisdevie.tatsuki;

/**
 * Represents a group of flags of type {@link F} and the relationships between
 * them. It also provides methods to use {@link S} as a set of those flags.
 *
 * @param <F> The type of values in the set.
 * @param <S> The type to be used as a set.
 */
public interface FlagSet<F, S> {
    /**
     * Creates an empty set of flags.
     */
    S empty();

    /**
     * Computes the union of two sets of flags.
     *
     * @param first  The first set of flags.
     * @param second The second set of flags.
     * @return A new set that contains the flags of both sets.
     */
    S union(S first, S second);

    /**
     * Computes the intersection of two set of flags.
     *
     * @param first  The first set of flags.
     * @param second The second set of flags.
     * @return A new set that contains the flags that appear both in the first
     * set and the second set.
     */
    S intersection(S first, S second);

    /**
     * Computes the difference of two set of flags.
     *
     * @param first  The first set of flags.
     * @param second The second set of flags (that will be subtracted from the
     *               first).
     * @return A new set that contains the flags of the first set that do not
     * appear in the second.
     */
    S difference(S first, S second);

    /**
     * Checks whether the first set of flags is a superset of the second.
     *
     * @param first  The first set of flags.
     * @param second The second set of flags.
     */
    boolean isSuperset(S first, S second);

    /**
     * Returns an iterable over the individual flags in a set.
     *
     * @param flags A set of flags.
     */
    Iterable<F> enumerate(S flags);

    /**
     * Filters a flag set so that it only contains the flags that were defined
     * in this set. If a flags is missing some of its parents, it will not be
     * included in the result.
     *
     * @param flags The set of flags to filter.
     * @return A new set of flags.
     * @see #maximum
     */
    S minimum(S flags);

    /**
     * Filters a flag set so that it only contains the flags that were defined
     * in this set. If a flags is missing some of its parents, they will be
     * added to the result.
     *
     * @param flags The set of flags to filter.
     * @return A new set of flags.
     * @see #minimum
     */
    S maximum(S flags);
}
