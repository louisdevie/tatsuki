package fr.louisdevie.tatsuki;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


public class BitFlagSetTests {
    @Test
    public void empty() {
        var flags = new BitFlagSet();

        assertEquals(0, flags.empty());
    }

    @Test
    public void union() {
        final var flags = new BitFlagSet();

        assertEquals(0, flags.union(0, 0));
        assertEquals(1, flags.union(1, 0));
        assertEquals(2, flags.union(0, 2));
        assertEquals(3, flags.union(1, 2));
        assertEquals(7, flags.union(3, 6));
    }

    @Test
    public void difference() {
        var flags = new BitFlagSet();

        assertEquals(0, flags.difference(0, 0));
        assertEquals(1, flags.difference(1, 0));
        assertEquals(1, flags.difference(3, 6));
        assertEquals(4, flags.difference(6, 3));
        assertEquals(8, flags.difference(8, 17));
    }

    @Test
    public void intersection() {
        var flags = new BitFlagSet();

        assertEquals(0, flags.intersection(0, 0));
        assertEquals(0, flags.intersection(1, 0));
        assertEquals(0, flags.intersection(1, 2));
        assertEquals(1, flags.intersection(1, 3));
        assertEquals(1, flags.intersection(11, 5));
        assertEquals(3, flags.intersection(11, 7));
    }

    @Test
    public void isSuperset() {
        var flags = new BitFlagSet();

        assertTrue(flags.isSuperset(0, 0));
        assertTrue(flags.isSuperset(3, 0));
        assertTrue(flags.isSuperset(3, 1));
        assertTrue(flags.isSuperset(3, 3));
        assertFalse(flags.isSuperset(0, 3));
        assertFalse(flags.isSuperset(8, 4));
    }

    @Test
    public void enumerate() {
        var flags = new BitFlagSet();

        assertIterableEquals(List.of(), flags.enumerate(0));
        assertIterableEquals(List.of(1), flags.enumerate(1));
        assertIterableEquals(List.of(2), flags.enumerate(2));
        assertIterableEquals(List.of(1, 2), flags.enumerate(3));
        assertIterableEquals(List.of(1, 2, 8), flags.enumerate(11));
        assertIterableEquals(List.of(4, 32, 64), flags.enumerate(100));
    }
}
