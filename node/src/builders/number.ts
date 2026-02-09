import { BitFlagSet } from '../flagsets'
import {
    DefineFlag,
    RequireParentsOrDefineFlag,
    SetValueOrCompose,
} from './syntax'

export class BitFlagSetBuilder
    implements
        RequireParentsOrDefineFlag<BitFlagSet>,
        SetValueOrCompose<BitFlagSet>
{
    public define(name: string): SetValueOrCompose<BitFlagSet> {
        return this
    }

    public requires(...flags: string[]): DefineFlag<BitFlagSet> {
        return this
    }

    public withValue(value: number): RequireParentsOrDefineFlag<BitFlagSet> {
        return this
    }

    public compose(...flags: string[]): DefineFlag<BitFlagSet> {
        return this
    }

    public build(): BitFlagSet {
        return new BitFlagSet()
    }
}
