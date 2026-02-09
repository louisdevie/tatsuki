export interface EnumerateFlags<T> extends Iterable<T> {
    forEach(callback: (value: T) => void, thisArg?: any): void
}

export { useIterator } from './factory'

export { Base64BitflagIterator } from './base64'
export { BigBitFlagsIterator } from './bigint'
export { BitFlagsIterator } from './number'
