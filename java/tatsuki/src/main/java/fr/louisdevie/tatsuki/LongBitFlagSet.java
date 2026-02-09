package fr.louisdevie.tatsuki;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class LongBitFlagSet implements FlagSet<Long, Long> {
    public Long empty() {
        return 0L;
    }

    public Long union(Long first, Long second) {
        return first | second;
    }

    public Long intersection(Long first, Long second) {
        return first & second;
    }

    public Long difference(Long first, Long second) {
        return first & ~second;
    }

    public boolean isSuperset(Long first, Long second) {
        return (first & second) == second;
    }

    public Iterable<Long> enumerate(Long flags) {
        return new IterableBitFlags(flags);
    }

    public Long minimum(Long flags) {
        return 0L;
    }

    public Long maximum(Long flags) {
        return 0L;
    }

    private record IterableBitFlags(long value) implements Iterable<Long> {
        public Iterator<Long> iterator() {
            return new BitFlagsIterator(this.value);
        }
    }

    private static class BitFlagsIterator implements Iterator<Long> {
        private long value;
        private long current;

        public BitFlagsIterator(long value) {
            this.value = value;
            this.current = 1L;
        }

        public boolean hasNext() {
            return this.value != 0L;
        }

        public Long next() {
            if (this.value == 0L) {
                throw new NoSuchElementException();
            }

            while ((this.value & 1L) == 0L) {
                this.value >>= 1;
                this.current <<= 1;
            }

            long element = this.current;
            this.value >>= 1;
            this.current <<= 1;

            return element;
        }
    }
}
