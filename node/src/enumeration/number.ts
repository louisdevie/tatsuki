export class BitFlagsIterator implements Iterator<number> {
    private _value: number
    private _current: number

    public constructor(value: number) {
        this._value = value
        this._current = 1
    }

    public next(): IteratorResult<number, undefined> {
        if (this._value == 0) {
            return { done: true, value: undefined }
        }

        while ((this._value & 1) == 0) {
            this._value >>= 1
            this._current <<= 1
        }

        const result = this._current
        this._value >>= 1
        this._current <<= 1

        return { done: false, value: result }
    }
}
