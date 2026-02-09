package fr.louisdevie.tatsuki;

import java.util.Iterator;
import java.util.NoSuchElementException;

public class BitFlagSet implements FlagSet<Integer, Integer> {
    public Integer empty() {
        return 0;
    }

    public Integer union(Integer first, Integer second) {
        return first | second;
    }

    public Integer intersection(Integer first, Integer second) {
        return first & second;
    }

    public Integer difference(Integer first, Integer second) {
        return first & ~second;
    }

    public boolean isSuperset(Integer first, Integer second) {
        return (first & second) == second;
    }

    public Iterable<Integer> enumerate(Integer flags) {
        return new IterableBitFlags(flags);
    }

    public Integer minimum(Integer flags) {
        return 0;
    }

    public Integer maximum(Integer flags) {
        return 0;
    }

    private record IterableBitFlags(int value) implements Iterable<Integer> {
        public Iterator<Integer> iterator() {
            return new BitFlagsIterator(this.value);
        }
    }

    private static class BitFlagsIterator implements Iterator<Integer> {
        private int value;
        private int current;

        public BitFlagsIterator(int value) {
            this.value = value;
            this.current = 1;
        }

        public boolean hasNext() {
            return this.value != 0;
        }

        public Integer next() {
            if (this.value == 0) {
                throw new NoSuchElementException();
            }

            while ((this.value & 1) == 0) {
                this.value >>= 1;
                this.current <<= 1;
            }

            int element = this.current;
            this.value >>= 1;
            this.current <<= 1;

            return element;
        }
    }
}
