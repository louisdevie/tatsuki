package fr.louisdevie.tatsuki;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


public class LongBitFlagSetTests {
    @Test
    public void empty() {
        var flags = new LongBitFlagSet();

        assertEquals(0L, flags.empty());
    }

    @Test
    public void union() {
        final var flags = new LongBitFlagSet();

        assertEquals(0L, flags.union(0L, 0L));
        assertEquals(1L, flags.union(1L, 0L));
        assertEquals(2L, flags.union(0L, 2L));
        assertEquals(3L, flags.union(1L, 2L));
        assertEquals(7, flags.union(3L, 6L));
    }

    @Test
    public void difference() {
        var flags = new LongBitFlagSet();

        assertEquals(0L, flags.difference(0L, 0L));
        assertEquals(1L, flags.difference(1L, 0L));
        assertEquals(1L, flags.difference(3L, 6L));
        assertEquals(4, flags.difference(6L, 3L));
        assertEquals(8, flags.difference(8L, 17L));
    }

    @Test
    public void intersection() {
        var flags = new LongBitFlagSet();

        assertEquals(0L, flags.intersection(0L, 0L));
        assertEquals(0L, flags.intersection(1L, 0L));
        assertEquals(0L, flags.intersection(1L, 2L));
        assertEquals(1L, flags.intersection(1L, 3L));
        assertEquals(1L, flags.intersection(11L, 5L));
        assertEquals(3L, flags.intersection(11L, 7L));
    }

    @Test
    public void isSuperset() {
        var flags = new LongBitFlagSet();

        assertTrue(flags.isSuperset(0L, 0L));
        assertTrue(flags.isSuperset(3L, 0L));
        assertTrue(flags.isSuperset(3L, 1L));
        assertTrue(flags.isSuperset(3L, 3L));
        assertFalse(flags.isSuperset(0L, 3L));
        assertFalse(flags.isSuperset(8L, 4L));
    }

    @Test
    public void enumerate() {
        var flags = new LongBitFlagSet();

        assertIterableEquals(List.of(), flags.enumerate(0L));
        assertIterableEquals(List.of(1L), flags.enumerate(1L));
        assertIterableEquals(List.of(2L), flags.enumerate(2L));
        assertIterableEquals(List.of(1L, 2L), flags.enumerate(3L));
        assertIterableEquals(List.of(1L, 2L, 8L), flags.enumerate(11L));
        assertIterableEquals(List.of(4L, 32L, 64L), flags.enumerate(100L));
    }
}
