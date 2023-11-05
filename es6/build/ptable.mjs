export class InvalidPTableItemError extends Error {
}
/**
 * Provides a standardized method of picking from a list of options based on RNG.
 */
export class PTable {
    constructor(items) {
        /** The items that this table can roll. */
        this.items = [];
        this.weightSum = 0;
        if (items)
            this.add(...items);
    }
    /**
     * Create an item and add it to our item list.
     * Updates the roll values.
     * @param value
     * @param weight
     */
    create(value, weight) {
        if (weight <= 0)
            throw new InvalidPTableItemError("need positive weight value");
        this.add({ value: value, weight: weight });
    }
    /**
     * Adds items to our item list.
     * Updates the roll values.
     * @param items
     */
    add(...items) {
        for (let item of items) {
            if (item.weight <= 0)
                throw new InvalidPTableItemError("need positive weight value");
            this.items.push({
                value: item.value,
                weight: item.weight,
                p: 0,
                min: 0,
                max: 0
            });
            this.weightSum += item.weight;
        }
        this.update();
    }
    /**
     * Update roll values for items.
     */
    update() {
        let last = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const p = item.weight / this.weightSum;
            item.p = p;
            item.min = last;
            item.max = last + p;
            if (i === this.items.length - 1)
                item.max = 1; // avoids stupid problems
            last = item.max;
        }
    }
    /**
     * Roll a random item.
     * @param p Provide a roll generated externally.
     * @returns {T}
     */
    roll(p) {
        if (p !== undefined && (p < 0 || p > 1))
            throw new Error(`invalid p value: ${p}; must be positive number between 0 (inclusive) and 1 (inclusive)`);
        const seed = p || Math.random();
        for (let i = 0; i < this.items.length; i++)
            if (seed <= this.items[i].max)
                return this.items[i].value;
        throw new Error("table is fricken messed up; did not return a result -- not actually possible!");
    }
}
