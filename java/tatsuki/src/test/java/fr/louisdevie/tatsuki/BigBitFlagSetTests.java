package fr.louisdevie.tatsuki;

import org.junit.jupiter.api.Test;

import java.math.BigInteger;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


public class BigBitFlagSetTests {
    private static BigInteger big(int value) {
        return BigInteger.valueOf(value);
    }

    @Test
    public void empty() {
        var flags = new BigBitFlagSet();

        assertEquals(big(0), flags.empty());
    }

    @Test
    public void union() {
        final var flags = new BigBitFlagSet();

        assertEquals(big(0), flags.union(big(0), big(0)));
        assertEquals(big(1), flags.union(big(1), big(0)));
        assertEquals(big(2), flags.union(big(0), big(2)));
        assertEquals(big(3), flags.union(big(1), big(2)));
        assertEquals(big(7), flags.union(big(3), big(6)));
    }

    @Test
    public void difference() {
        var flags = new BigBitFlagSet();

        assertEquals(big(0), flags.difference(big(0), big(0)));
        assertEquals(big(1), flags.difference(big(1), big(0)));
        assertEquals(big(1), flags.difference(big(3), big(6)));
        assertEquals(big(4), flags.difference(big(6), big(3)));
        assertEquals(big(8), flags.difference(big(8), big(17)));
    }

    @Test
    public void intersection() {
        var flags = new BigBitFlagSet();

        assertEquals(big(0), flags.intersection(big(0), big(0)));
        assertEquals(big(0), flags.intersection(big(1), big(0)));
        assertEquals(big(0), flags.intersection(big(1), big(2)));
        assertEquals(big(1), flags.intersection(big(1), big(3)));
        assertEquals(big(1), flags.intersection(big(11), big(5)));
        assertEquals(big(3), flags.intersection(big(11), big(7)));
    }

    @Test
    public void isSuperset() {
        var flags = new BigBitFlagSet();

        assertTrue(flags.isSuperset(big(0), big(0)));
        assertTrue(flags.isSuperset(big(3), big(0)));
        assertTrue(flags.isSuperset(big(3), big(1)));
        assertTrue(flags.isSuperset(big(3), big(3)));
        assertFalse(flags.isSuperset(big(0), big(3)));
        assertFalse(flags.isSuperset(big(8), big(4)));
    }

    @Test
    public void enumerate() {
        var flags = new BigBitFlagSet();

        assertIterableEquals(List.of(), flags.enumerate(big(0)));
        assertIterableEquals(List.of(big(1)), flags.enumerate(big(1)));
        assertIterableEquals(List.of(big(2)), flags.enumerate(big(2)));
        assertIterableEquals(List.of(big(1), big(2)), flags.enumerate(big(3)));
        assertIterableEquals(List.of(big(1), big(2), big(8)), flags.enumerate(big(11)));
        assertIterableEquals(List.of(big(4), big(32), big(64)), flags.enumerate(big(100)));
    }
}
