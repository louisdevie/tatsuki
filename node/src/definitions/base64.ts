import { decodeB64Byte, encodeB64Byte, normaliseB64String, ZERO_STRING } from '~/base64'

import { FlagDefinition, FlagDefinitionFactory, PartialFlagDefinition } from '.'

interface PrecomputedValues {
    base: string
    additive: string
    subtractive: string
}

function union(first: string, second: string): string {
    const [shorter, longer] = first.length < second.length ? [first, second] : [second, first]
    let result = ''
    for (let i = 0; i < longer.length; i++) {
        if (i < shorter.length) {
            const value = decodeB64Byte(shorter[i]) | decodeB64Byte(longer[i])
            result += encodeB64Byte(value)
        } else {
            result += longer[i]
        }
    }
    return normaliseB64String(result)
}

export class Base64BitFlagDefinition implements FlagDefinition<string> {
    private readonly _baseValue: string
    private readonly _additiveValue: string
    private readonly _subtractiveValue: string
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

    public get values(): string {
        return this._baseValue
    }

    public isIn(set: string): boolean {
        let result = set.length >= this._additiveValue.length
        for (let i = 0; i < this._additiveValue.length && result; i++) {
            const value = decodeB64Byte(this._additiveValue[i])
            result = (decodeB64Byte(set[i]) & value) === value
        }
        return result
    }

    public addTo(set: string): string {
        return union(set, this._additiveValue)
    }

    public removeFrom(set: string): string {
        return set
    }
}

export class Base64BitFlagDefinitionFactory implements FlagDefinitionFactory<number, string> {
    public makeDefinitions(
        sortedPartialDefinitions: PartialFlagDefinition<number>[],
        results: Map<PartialFlagDefinition<number>, FlagDefinition<string>>,
    ): void {
        const precomputedValues = new Map<PartialFlagDefinition<number>, PrecomputedValues>()

        for (let i = 0; i < sortedPartialDefinitions.length; i++) {
            const pfd = sortedPartialDefinitions[i]

            let stringValue = ZERO_STRING
            if (pfd.value !== undefined) {
                if (pfd.value < 1) {
                    throw new RangeError('Indices should be greater than or equal to 1.')
                }
                const indexFromZero = pfd.value - 1
                const leadingBytes = ZERO_STRING.repeat(indexFromZero / 6)
                const bigEnd = encodeB64Byte(1 << indexFromZero % 6)
                stringValue = leadingBytes + bigEnd
            }

            const values: PrecomputedValues = {
                base: stringValue,
                additive: stringValue,
                subtractive: stringValue,
            }

            for (const parentPfd of pfd.parents) {
                const parentValues = precomputedValues.get(parentPfd)
                if (parentValues !== undefined) {
                    values.additive = union(values.additive, parentValues.additive)
                    if (pfd.value === undefined) {
                        values.base = union(values.base, parentValues.base)
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
                    values.subtractive = union(values.subtractive, childValues.subtractive)
                }
            }

            results.set(pfd, new Base64BitFlagDefinition(values, pfd.alias))
        }
    }
}
