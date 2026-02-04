package fr.louisdevie.tatsuki;

import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class LibraryTest {
    @Test
    public void someLibraryMethodReturnsTrue() {
        Library classUnderTest = new Library();
        assertTrue("someLibraryMethod should return 'true'", classUnderTest.someLibraryMethod());
    }
}
