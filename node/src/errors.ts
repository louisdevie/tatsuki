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
 * Error thrown by `FlagSet`s that store the flags using a binary format when a
 * flag value isn't a power of two.
 */
export class InvalidBitFlagValueError extends Error {
    /** @internal */
    public constructor() {
        super('Flag values for bit flags must be powers of two.')
    }
}

/**
 * Error thrown if the {@link FlagSet.flag} method is called with a value that
 * was already used for another flag in the same `FlagSet`.
 */
export class ReusedFlagValueError extends Error {
    /** @internal */
    public constructor(value: any) {
        super(`The flag value ${value} is already being used for another flag.`)
    }
}
