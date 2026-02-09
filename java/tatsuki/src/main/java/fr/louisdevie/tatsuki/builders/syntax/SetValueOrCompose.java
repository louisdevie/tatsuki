package fr.louisdevie.tatsuki.builders.syntax;

public interface SetValueOrCompose<X> {
    RequireParentsOrDefineFlag<X> withValue(int value);

    DefineFlag<X> compose(String ...flags);
}
