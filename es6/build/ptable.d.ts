/**
 * The skeleton of a PTableItem.
 * Provides the value that'll be returned when the item is rolled as well as the weight for the item.
 * These items are used by a PTable to generate an array of PTableItems for the purpose of rolling.
 */
export interface PTableItemPre<T> {
    /** The value returned when the item is rolled. */
    value: T;
    /** The relative weight of the item. */
    weight: number;
}
/**
 * The items rolled by a PTable.
 */
export interface PTableItem<T> extends PTableItemPre<T> {
    p: number;
    min: number;
    max: number;
}
export declare class InvalidPTableItemError extends Error {
}
/**
 * Provides a standardized method of picking from a list of options based on RNG.
 */
export declare class PTable<T> {
    /** The items that this table can roll. */
    items: PTableItem<T>[];
    private weightSum;
    constructor(items?: PTableItemPre<T>[]);
    /**
     * Create an item and add it to our item list.
     * Updates the roll values.
     * @param value
     * @param weight
     */
    create(value: T, weight: number): void;
    /**
     * Adds items to our item list.
     * Updates the roll values.
     * @param items
     */
    add(...items: PTableItemPre<T>[]): void;
    /**
     * Update roll values for items.
     */
    private update;
    /**
     * Roll a random item.
     * @param p Provide a roll generated externally.
     * @returns {T}
     */
    roll(p?: number): T;
}
//# sourceMappingURL=ptable.d.ts.map