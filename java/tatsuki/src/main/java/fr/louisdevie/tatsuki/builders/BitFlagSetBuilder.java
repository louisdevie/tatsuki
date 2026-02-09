package fr.louisdevie.tatsuki.builders;

import fr.louisdevie.tatsuki.BitFlagSet;
import fr.louisdevie.tatsuki.builders.syntax.DefineFlag;
import fr.louisdevie.tatsuki.builders.syntax.SetValueOrCompose;

public class BitFlagSetBuilder implements DefineFlag<BitFlagSet> {
    public SetValueOrCompose<BitFlagSet> define(String name) {
        return null;
    }

    public BitFlagSet build() {
        return new BitFlagSet();
    }
}
