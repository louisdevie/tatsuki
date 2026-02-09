package fr.louisdevie.tatsuki;

import java.math.BigInteger;
import java.util.Iterator;
import java.util.NoSuchElementException;

public class BigBitFlagSet implements FlagSet<BigInteger, BigInteger> {
    public BigInteger empty() {
        return BigInteger.ZERO;
    }

    public BigInteger union(BigInteger first, BigInteger second) {
        return first.or(second);
    }

    public BigInteger intersection(BigInteger first, BigInteger second) {
        return first.and(second);
    }

    public BigInteger difference(BigInteger first, BigInteger second) {
        return first.andNot(second);
    }

    public boolean isSuperset(BigInteger first, BigInteger second) {
        return first.and(second).equals(second);
    }

    public Iterable<BigInteger> enumerate(BigInteger flags) {
        return new IterableBitFlags(flags);
    }

    public BigInteger minimum(BigInteger flags) {
        return BigInteger.ZERO;
    }

    public BigInteger maximum(BigInteger flags) {
        return BigInteger.ZERO;
    }

    private record IterableBitFlags(BigInteger value) implements Iterable<BigInteger> {
        public Iterator<BigInteger> iterator() {
            return new BitFlagsIterator(this.value);
        }
    }

    private static class BitFlagsIterator implements Iterator<BigInteger> {
        private BigInteger value;
        private BigInteger current;

        public BitFlagsIterator(BigInteger value) {
            this.value = value;
            this.current = BigInteger.ONE;
        }

        public boolean hasNext() {
            return !this.value.equals(BigInteger.ZERO);
        }

        public BigInteger next() {
            if (this.value.equals(BigInteger.ZERO)) {
                throw new NoSuchElementException();
            }

            while (!this.value.testBit(0)) {
                this.value = this.value.shiftRight(1);
                this.current = this.current.shiftLeft(1);
            }

            BigInteger element = this.current;
            this.value = this.value.shiftRight(1);
            this.current = this.current.shiftLeft(1);

            return element;
        }
    }
}
