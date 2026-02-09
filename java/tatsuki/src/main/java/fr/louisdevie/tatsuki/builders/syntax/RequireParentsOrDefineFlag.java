package fr.louisdevie.tatsuki.builders.syntax;

public interface RequireParentsOrDefineFlag<X> extends DefineFlag<X> {
    DefineFlag<X> requires(String ...flags);
}
