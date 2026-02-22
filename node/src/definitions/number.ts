import { FlagDefinition, valueToString } from '.'

export class BitFlagDefinition implements FlagDefinition<number, number> {
    private readonly _baseValues: number
    private readonly _additiveValues: number
    private readonly _subtractiveValues: number
    private readonly _alias: string | undefined

    public constructor(
        baseValues: number,
        additiveValues: number,
        subtractiveValues: number,
        alias: string | undefined,
    ) {
        this._baseValues = baseValues
        this._additiveValues = additiveValues
        this._subtractiveValues = subtractiveValues
        this._alias = alias
    }

    public get alias(): string | undefined {
        return this._alias
    }

    public get values(): number {
        return this._baseValues
    }

    public hasSameValue(other: FlagDefinition<number, number>): boolean {
        return other instanceof BitFlagDefinition && this._baseValues === other._baseValues
    }
}
