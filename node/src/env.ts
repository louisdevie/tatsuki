export const ENV_BI = Object.freeze(
    typeof BigInt === 'function'
        ? { AVAILABLE: true, ZERO: BigInt(0), ONE: BigInt(1) }
        : { AVAILABLE: false },
) as {
    readonly AVAILABLE: boolean
    readonly ZERO: bigint
    readonly ONE: bigint
}

type SetBinaryOperation = <T>(this: Set<T>, other: Set<T>) => Set<T>
type SetBinaryPredicate = <T>(this: Set<T>, other: Set<T>) => boolean

export const ENV_SET = Object.freeze(
    typeof Set === 'function'
        ? {
              AVAILABLE: true,
              union: polyfillUnion(Set.prototype),
              intersection: polyfillIntersection(Set.prototype),
              difference: polyfillDifference(Set.prototype),
              isSupersetOf: polyfillIsSupersetOf(Set.prototype),
          }
        : { AVAILABLE: false },
) as {
    readonly AVAILABLE: boolean
    readonly union: SetBinaryOperation
    readonly intersection: SetBinaryOperation
    readonly difference: SetBinaryOperation
    readonly isSupersetOf: SetBinaryPredicate
}

function polyfillUnion(proto: object | undefined): SetBinaryOperation {
    if (proto && 'union' in proto) {
        return proto.union as SetBinaryOperation
    } else {
        return function <T>(this: Set<T>, other: Set<T>) {
            if (!(this instanceof Set) || !(this instanceof Set)) {
                throw new TypeError('Arguments must be instances of Set')
            }

            const unionSet = new Set(this)
            for (const item of other) {
                unionSet.add(item)
            }

            return unionSet
        }
    }
}

function polyfillIntersection(proto: object | undefined): SetBinaryOperation {
    if (proto && 'intersection' in proto) {
        return proto.intersection as SetBinaryOperation
    } else {
        return function <T>(this: Set<T>, other: Set<T>) {
            if (!(this instanceof Set) || !(other instanceof Set)) {
                throw new TypeError('Arguments must be instances of Set')
            }

            const differenceSet = new Set<T>()
            for (const item of this) {
                if (other.has(item)) {
                    differenceSet.add(item)
                }
            }

            return differenceSet
        }
    }
}

function polyfillDifference(proto: object | undefined): SetBinaryOperation {
    if (proto && 'difference' in proto) {
        return proto.difference as SetBinaryOperation
    } else {
        return function <T>(this: Set<T>, other: Set<T>) {
            if (!(this instanceof Set) || !(other instanceof Set)) {
                throw new TypeError('Arguments must be instances of Set')
            }

            const differenceSet = new Set<T>()
            for (const item of this) {
                if (!other.has(item)) {
                    differenceSet.add(item)
                }
            }

            return differenceSet
        }
    }
}

function polyfillIsSupersetOf(proto: object | undefined): SetBinaryPredicate {
    if (proto && 'isSupersetOf' in proto) {
        return proto.isSupersetOf as SetBinaryPredicate
    } else {
        return function <T>(this: Set<T>, other: Set<T>) {
            if (!(this instanceof Set) || !(other instanceof Set)) {
                throw new TypeError('Arguments must be instances of Set')
            }

            for (const item of other) {
                if (!this.has(item)) {
                    return false
                }
            }

            return true
        }
    }
}
