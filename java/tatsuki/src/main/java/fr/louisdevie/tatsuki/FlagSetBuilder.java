package fr.louisdevie.tatsuki;

import fr.louisdevie.tatsuki.builders.BitFlagSetBuilder;
import fr.louisdevie.tatsuki.builders.syntax.DefineFlag;
import fr.louisdevie.tatsuki.builders.syntax.SelectFlagSetType;

public class FlagSetBuilder implements SelectFlagSetType {
    public DefineFlag<BitFlagSet> useBitFlags() {
        return new BitFlagSetBuilder();
    }
}

