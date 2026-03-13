import { ENV_BI } from '~/env'

import { FlagDefinition, FlagDefinitionFactory, PartialFlagDefinition } from '.'

interface PrecomputedValues {
    base: bigint
    additive: bigint
    subtractive: bigint
}

export class BigBitFlagDefinition implements FlagDefinition<bigint> {
    private readonly _baseValue: bigint
    private readonly _additiveValue: bigint
    private readonly _subtractiveValue: bigint
    private readonly _alias: string | undefined

    public constructor(precomputedValues: PrecomputedValues, alias: string | undefined) {
        this._baseValue = precomputedValues.base
        this._additiveValue = precomputedValues.additive
        this._subtractiveValue = precomputedValues.subtractive
        this._alias = alias
    }

    public get alias(): string | undefined {
        return this._alias
    }

    public get values(): bigint {
        return this._baseValue
    }

    public isIn(set: bigint): boolean {
        return (set & this._additiveValue) === this._additiveValue
    }

    public addTo(set: bigint): bigint {
        return set | this._additiveValue
    }

    public removeFrom(set: bigint): bigint {
        return set | this._additiveValue
    }
}

export class BigBitFlagDefinitionFactory implements FlagDefinitionFactory<bigint, bigint> {
    public makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<bigint>[],
        results: Map<PartialFlagDefinition<bigint>, FlagDefinition<bigint>>,
    ): void {
        const precomputedValues = new Map<PartialFlagDefinition<bigint>, PrecomputedValues>()

        for (let i = 0; i < sortedPartialDefinitions.length; i++) {
            const pfd = sortedPartialDefinitions[i]

            const values: PrecomputedValues = {
                base: pfd.value ?? ENV_BI.ZERO,
                additive: pfd.value ?? ENV_BI.ZERO,
                subtractive: pfd.value ?? ENV_BI.ZERO,
            }

            for (const parentPfd of pfd.parents) {
                const parentValues = precomputedValues.get(parentPfd)
                if (parentValues !== undefined) {
                    values.additive = values.additive | parentValues.additive
                    if (pfd.value === undefined) {
                        values.base = values.base | parentValues.base
                    }
                }
            }

            precomputedValues.set(pfd, values)
        }

        for (let i = sortedPartialDefinitions.length - 1; i >= 0; i--) {
            const pfd = sortedPartialDefinitions[i]
            const values = precomputedValues.get(pfd)!

            for (const childPfd of pfd.children) {
                const childValues = precomputedValues.get(childPfd)
                if (childValues !== undefined) {
                    values.subtractive = values.subtractive | childValues.subtractive
                }
            }

            results.set(pfd, new BigBitFlagDefinition(values, pfd.alias))
        }
    }
}
