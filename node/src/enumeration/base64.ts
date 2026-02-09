import { decodeB64Byte, ZERO_STRING } from '../base64'

export class Base64BitflagIterator implements Iterator<number> {
    private _value: string
    private _currentByte: number
    private _currentBit: number

    public constructor(value: string) {
        this._value = value
        this._currentByte = 0
        this._currentBit = 0
    }

    private moveToNextByte(): boolean {
        // next multiple of 6
        let index = Math.ceil(this._currentBit / 6)
        let byte = this._value.charAt(index)

        while (byte === ZERO_STRING) {
            // skip bytes equal to zero
            byte = this._value.charAt(++index)
        }

        if (byte === '') {
            // reached the end of the string
            return false
        } else {
            // found a non-zero byte
            this._currentByte = decodeB64Byte(byte)
            this._currentBit = index * 6
            return true
        }
    }

    public next(): IteratorResult<number, undefined> {
        if (this._currentByte == 0) {
            if (!this.moveToNextByte()) {
                return { done: true, value: undefined }
            }
        }

        while ((this._currentByte & 1) == 0) {
            this._currentByte >>= 1
            this._currentBit += 1
        }

        this._currentByte >>= 1
        this._currentBit += 1

        return { done: false, value: this._currentBit }
    }
}
