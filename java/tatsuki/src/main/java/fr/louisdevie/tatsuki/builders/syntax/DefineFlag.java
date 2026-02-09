package fr.louisdevie.tatsuki.builders.syntax;

import fr.louisdevie.tatsuki.BitFlagSet;

public interface DefineFlag<X> {
    SetValueOrCompose<X> define(String name);

    X build();
}
