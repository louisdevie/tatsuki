import type { EnumerateFlags } from '.'

export function useIterator<S, F>(
    value: S,
    IterConstructor: { new (value: S): Iterator<F> }
): EnumerateFlags<F> {
    const enumerate = {
        _value: value,

        [Symbol.iterator]: function () {
            return new IterConstructor(this._value)
        },

        forEach: function (callback: (value: F) => void, thisArg?: any) {
            const iter = new IterConstructor(this._value)
            let result = iter.next()
            while (!result.done) {
                callback.call(thisArg, result.value)
                result = iter.next()
            }
        },
    }
    return enumerate as EnumerateFlags<F>
}
