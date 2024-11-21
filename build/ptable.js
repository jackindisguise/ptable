// Math.random() cannot produce a number larger than this
export const LARGEST_VALID_RANGE = 0.999999999;
// need to figure out how to implement this to throw an error
export const SMALLEST_VALID_RANGE = 0.000000001;
/**
 * A probability table is a set of items that have an assigned probability.
 *
 * The goal of the probability table is to make it quick and easy to assign
 * a set chance on multiple outcomes of a single event.
 *
 * ```TypeScript
 * import {PTable} from "ptable";
 * const p = new PTable<string>();
 * p.add({value: "blah", weight: 1}); // add an entry for the string "blah" with a weight of 1
 * p.create("cake", 2); // shortcut for adding a string "cake" with a weight of 2
 * p.create("pie", 5);
 *
 * for(let i=0;i<10000;i++){
 * 	const result = p.roll();
 * }
 * // ...
 * ```
 */
export class PTable {
    constructor() {
        this.editMode = false;
        this.totalWeight = 0;
        this.entries = [];
    }
    /**
     * Add a series of entries to the PTable.
     *
     * After adding all entries, the probability ranges will be re-intialized for all entries
     * based on the change in the total weight of all entries added.
     *
     * When adding lots of entries, you may want to look into {@link PTable#populate}.
     * @see {@link PTable#populate}
     * @param entries The set of precursor PTable entries to add.
     */
    add(...entries) {
        for (let entry of entries) {
            this.totalWeight += entry.weight;
            this.entries.push({
                value: entry.value,
                weight: entry.weight,
                relativeWeight: 0,
                low: 0,
                high: 0,
            });
        }
        if (!this.editMode)
            this.initializeEntryRanges();
    }
    /**
     * Create a new PTable entry.
     * @param value The value of the entry.
     * @param weight The weight of the entry.
     */
    create(value, weight) {
        this.add({ value: value, weight: weight });
    }
    /**
     * Enables edit mode, which disables re-initializing entry ranges with every addition.
     *
     * Edit mode is only enabled during the call of the provided callback function, which is executed immediately.
     *
     * After the callback function ends, edit mode is disabled.
     * @param edit A function called during edit mode.
     */
    populate(edit) {
        this.editMode = true;
        edit();
        this.editMode = false;
        this.initializeEntryRanges();
    }
    /**
     * Re-calculates the ranges of all entries based on their weights.
     *
     * Called every time a new entry is added, unless edit mode is enabled.
     * @see {@link PTable#populate}
     */
    initializeEntryRanges() {
        let previous = 0;
        for (let entry of this.entries) {
            let range = entry.weight / this.totalWeight;
            entry.low = previous;
            entry.high = previous + range;
            if (entry.low == entry.high || entry.low == 1)
                throw new Error(`PTable entry range is impossible: ${entry.low} -> ${entry.high}`);
            entry.relativeWeight = range;
            previous = entry.high;
        }
    }
    /**
     * Generate a random number to use to pick an entry from the table.
     * @returns The rolled entry's value.
     * @throws {EmptyPTableError} Attempting to roll an empty PTable.
     * @throws {NoResultError} Failed to return a result. This generally means the provided P value is not within the range of any entries.
     */
    roll() {
        return this.preroll(Math.random());
    }
    /**
     * Accepts a P value between 0 and 1 that corresponds to the range of an entry in the PTable.
     *
     * If the p value falls within the range of the entry, its value will be returned.
     * @param p A value between 0 and 1.
     * @returns The value of the chosen entry.
     * @throws {EmptyPTableError} Attempting to roll an empty PTable.
     * @throws {NoResultError} Failed to return a result. This generally means the provided P value is not within the range of any entries.
     */
    preroll(p) {
        // empty PTable
        if (this.entries.length < 1)
            throw new EmptyPTableError("attempting to roll empty PTable.");
        // check for matching entry range
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (p >= entry.low && p <= entry.high)
                return entry.value;
        }
        // invalid P value
        throw new NoResultError("failed to produce result in PTable roll");
    }
}
/**
 * Thrown when attempting to roll an empty PTable.
 */
export class EmptyPTableError extends Error {
    constructor(message) {
        super(message);
        this.name = "EmptyPTableError";
    }
}
/**
 * Thrown when a PTable roll fails to return a result.
 */
export class NoResultError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoResultError";
    }
}
