import { FlagDefinition, FlagDefinitionFactory, PartialFlagDefinition } from '.'

interface PrecomputedValues {
    base: number
    additive: number
    subtractive: number
}

export class BitFlagDefinition implements FlagDefinition<number, number> {
    private readonly _baseValue: number
    private readonly _additiveValue: number
    private readonly _subtractiveValue: number
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

    public get values(): number {
        return this._baseValue
    }

    public isIn(set: number): boolean {
        return (set & this._additiveValue) === this._additiveValue
    }

    public addTo(set: number): number {
        return set | this._additiveValue
    }

    public removeFrom(set: number): number {
        return set | this._additiveValue
    }
}

export class BitFlagDefinitionFactory implements FlagDefinitionFactory<number, number> {
    public makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<number>[],
        results: Map<PartialFlagDefinition<number>, FlagDefinition<number, number>>,
    ): void {
        const precomputedValues = new Map<PartialFlagDefinition<number>, PrecomputedValues>()

        for (let i = 0; i < sortedPartialDefinitions.length; i++) {
            const pfd = sortedPartialDefinitions[i]

            const values: PrecomputedValues = {
                base: pfd.value ?? 0,
                additive: pfd.value ?? 0,
                subtractive: pfd.value ?? 0,
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

            results.set(pfd, new BitFlagDefinition(values, pfd.alias))
        }
    }
}
