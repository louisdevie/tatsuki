import { decodeB64Byte, encodeB64Byte, normaliseB64String, ZERO_STRING } from '~/base64'
import { FlagDefinition, FlagsDictionary } from '~/definitions'
import { Base64BitflagIterator, EnumerateFlags, useIterator } from '~/enumeration'

import type { FlagSet } from '.'

function toBase64(value: number): string {
    if (value < 1) {
        throw new RangeError('Indices should be greater than or equal to 1.')
    }
    const indexFromZero = value - 1
    const leadingBytes = ZERO_STRING.repeat(indexFromZero / 6)
    const bigEnd = encodeB64Byte(1 << indexFromZero % 6)
    return leadingBytes + bigEnd
}

/**
 * Provides flags that are stored in strings using a little-endian base 64
 * representation.
 *
 * This format is compact, easily serializable and allows for an unlimited
 * number of flags, but it is specific to Tatsuki. Use {@link CollectionFlagSet}
 * instead if you need the data to be easily understandable by other systems.
 */
export class Base64BitFlagSet implements FlagSet<number, string> {
    private readonly _dictionary: FlagsDictionary<number, string>

    public constructor(dictionary: FlagsDictionary<number, string>) {
        this._dictionary = dictionary
    }

    public none(): string {
        return ''
    }

    public of(...values: number[]): string {
        return normaliseB64String(
            values.reduce((set, value) => this.union(set, toBase64(value)), ZERO_STRING),
        )
    }

    public named(...aliases: string[]): string {
        return normaliseB64String(
            aliases.reduce(
                (set, alias) => this.union(set, this.getFlag(alias)?.values ?? ZERO_STRING),
                ZERO_STRING,
            ),
        )
    }

    public union(first: string, second: string): string {
        let result = ''

        let shorter, longer
        if (first.length < second.length) {
            shorter = first
            longer = second
        } else {
            shorter = second
            longer = first
        }

        let i = 0
        // OR the bytes one by one
        for (; i < shorter.length; i++) {
            const value = decodeB64Byte(shorter[i]) | decodeB64Byte(longer[i])
            result += encodeB64Byte(value)
        }
        // if one string is longer than the other, append the remaining bytes (x | 0 = x)
        for (; i < longer.length; i++) {
            result += longer[i]
        }

        return normaliseB64String(result)
    }

    public intersection(first: string, second: string): string {
        let result = ''

        const shorterLength = Math.min(first.length, second.length)
        let i = 0
        // AND the bytes one by one
        for (; i < shorterLength; i++) {
            const value = decodeB64Byte(first[i]) & decodeB64Byte(second[i])
            result += encodeB64Byte(value)
        }
        // if one string is longer than the other, don't add anything else (x & 0 = 0)

        return normaliseB64String(result)
    }

    public difference(first: string, second: string): string {
        let result = ''

        const shorterLength = Math.min(first.length, second.length)
        let i = 0
        // AND the bytes one by one
        for (; i < shorterLength; i++) {
            const value = decodeB64Byte(first[i]) & ~decodeB64Byte(second[i])
            result += encodeB64Byte(value)
        }
        // if the first string is longer than the other, append its remaining bytes (x & ~0 = x)
        // if the second string is longer, don't add anything (0 & ~y = 0)
        for (; i < first.length; i++) {
            result += first[i]
        }

        return normaliseB64String(result)
    }

    public isSuperset(first: string, second: string): boolean {
        let result = true

        const shorterLength = Math.min(first.length, second.length)
        let i = 0
        // AND the bytes one by one and check
        // if one is false we don't need to decode further
        for (; i < shorterLength && result; i++) {
            const secondValue = decodeB64Byte(second[i])
            result = (decodeB64Byte(first[i]) & secondValue) == secondValue
        }
        // if there are more characters in the second string, they must all be zeros
        // (0 & x is only equal to x when x is also 0)
        for (; i < second.length && result; i++) {
            result = second[i] == ZERO_STRING
        }

        return result
    }

    public hasAny(flags: string, required: string): boolean {
        return this.minimum(this.intersection(flags, required)) !== ''
    }

    public hasAll(flags: string, required: string): boolean {
        return this.isSuperset(flags, this.maximum(required))
    }

    public enumerate(flags: string): EnumerateFlags<number> {
        return useIterator(flags, Base64BitflagIterator)
    }

    public maximum(flags: string): string {
        let result = ZERO_STRING
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined) {
                result = definition.addTo(result)
            }
        }
        return normaliseB64String(result)
    }

    public minimum(flags: string): string {
        let result = ZERO_STRING
        for (const value of this.enumerate(flags)) {
            const definition = this._dictionary.findByValue(value)
            if (definition !== undefined && definition.isIn(flags)) {
                result = definition.addTo(result)
            }
        }
        return normaliseB64String(result)
    }

    public getFlag(alias: string): FlagDefinition<string> | undefined {
        return this._dictionary.findByAlias(alias)
    }
}
