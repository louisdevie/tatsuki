import { FlagDefinition, printFlagValue } from './definitions'
import pkg from '../package.json'

/**
 * Error thrown when a feature is not available in the current environment.
 */
export class UnavailableFeatureError extends Error {
    /** @internal */
    public constructor(feature: string) {
        super(`This environment does not seem to support ${feature}.`)
    }
}

/**
 * Error thrown when trying to define a flag stored in a binary with a value
 * that isn't a power of two.
 */
export class InvalidBitFlagValueError extends Error {
    /** @internal */
    public constructor() {
        super('Flag values for bit flags must be powers of two.')
    }
}

/**
 * Error thrown when trying to define a flag with an alias that was already used
 * for another flag in the same set.
 */
export class ReusedFlagAliasError extends Error {
    /** @internal */
    public constructor(alias: string) {
        super(`The flag "${alias}" has already been defined.`)
    }
}

/**
 * Error thrown when trying to define a flag with a value that was already used
 * for another flag in the same set.
 */
export class ReusedFlagValueError extends Error {
    /** @internal */
    public constructor(a: FlagDefinition<unknown, unknown>, b: FlagDefinition<unknown, unknown>) {
        super(
            `The value ${printFlagValue(a)} is already being used ${b.alias ? 'for the flag "' + b.alias + '"' : 'by another flag'}.`,
        )
    }
}

/**
 * Error thrown when calling builder methods in a state that is not allowed.
 */
export class InvalidOperationError extends Error {
    /** @internal */
    public constructor(methodName: string, explanation?: string) {
        super(`.${methodName}() is not allowed here${explanation ? ': ' + explanation : ''}.`)
    }
}

/**
 * Error thrown by builders when a flag references a flag that is not defined.
 */
export class UndefinedReferenceError extends Error {
    /** @internal */
    public constructor(alias: string, requiredBy: string) {
        super(`Undefined flag "${alias}" required by ${requiredBy}.`)
    }
}

/**
 * Error thrown by builders when a circular dependency is created.
 */
export class CircularReferenceError extends Error {
    /** @internal */
    public constructor(chain: string[]) {
        super(`Circular reference found: ${chain.join(' → ')}.`)
    }
}

export class InternalError extends Error {
    /** @internal */
    public constructor(message: string) {
        super(`[Tatsuki internal error] ${message}. Please report it at ${pkg.bugs.url}.`)
    }
}
