/**
 * The character code for "A", 0 in base 64.
 * @internal
 */
export const ZERO = 65

/**
 * The character code for "a", 26 in base 64.
 * @internal
 */
export const TWENTY_SIX = 97

/**
 * The character code for "0", 52 in base 64.
 * @internal
 */
export const FIFTY_TWO = 48

/**
 * The character code for "-", 62 in base 64.
 * @internal
 */
export const SIXTY_TWO = 45

/**
 * The character code for "_", 63 in base 64.
 * @internal
 */
export const SIXTY_THREE = 95

/**
 * The string "A", 0 in base 64.
 * @internal
 */
export const ZERO_STRING = 'A'

/** @internal */
export function encodeB64Byte(byte: number): string {
    let charCode
    if (byte < 26) {
        charCode = byte + ZERO
    } else if (byte < 52) {
        charCode = byte - 26 + TWENTY_SIX
    } else if (byte < 62) {
        charCode = byte - 52 + FIFTY_TWO
    } else {
        charCode = byte == 62 ? SIXTY_TWO : SIXTY_THREE
    }
    return String.fromCharCode(charCode)
}

/** @internal */
export function decodeB64Byte(encodedByte: string): number {
    const charCode = encodedByte.charCodeAt(0)
    if (charCode == SIXTY_THREE) {
        return 63
    } else if (charCode == SIXTY_TWO) {
        return 62
    } else if (charCode >= TWENTY_SIX) {
        return charCode - TWENTY_SIX + 26
    } else if (charCode >= ZERO) {
        return charCode - ZERO
    } else {
        return charCode - FIFTY_TWO + 52
    }
}

/** @internal */
export function normaliseB64String(encoded: string): string {
    let lastNonZeroByteIndex = encoded.length - 1
    while (encoded.charAt(lastNonZeroByteIndex) === ZERO_STRING) {
        lastNonZeroByteIndex--
    }
    return encoded.substring(0, lastNonZeroByteIndex + 1)
}
