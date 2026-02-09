import { ENV_BI } from '../env'

export class BigBitFlagsIterator implements Iterator<bigint> {
    private _value: bigint
    private _current: bigint

    public constructor(value: bigint) {
        this._value = value
        this._current = ENV_BI.ONE
    }

    public [Symbol.iterator](): IterableIterator<bigint> {
        return this
    }

    public next(): IteratorResult<bigint, undefined> {
        if (this._value == ENV_BI.ZERO) {
            return { done: true, value: undefined }
        }

        while ((this._value & ENV_BI.ONE) == ENV_BI.ZERO) {
            this._value >>= ENV_BI.ONE
            this._current <<= ENV_BI.ONE
        }

        const result = this._current
        this._value >>= ENV_BI.ONE
        this._current <<= ENV_BI.ONE

        return { done: false, value: result }
    }
}
