import type { SelectFlagSetType, DefineFlag } from './syntax'
import { BitFlagSetBuilder } from './number'
import { BitFlagSet } from '../flagsets'

export class FlagSetBuilder implements SelectFlagSetType {
    public useBitFlags(): DefineFlag<BitFlagSet> {
        return new BitFlagSetBuilder()
    }
}
