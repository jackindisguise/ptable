(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PTable = void 0;
    /**
     * Provides a standardized method of picking from a list of options based on RNG.
     */
    class PTable {
        constructor(items) {
            this.items = this.prepare(items);
        }
        /**
         * Prepare generic pre-items for use with the PTable.
         * @param items
         */
        prepare(items) {
            // generate sum for P values
            let sum = 0;
            for (let item of items)
                sum += item.weight;
            // generate P values and ranges
            let last = 0;
            const generatedItems = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const p = item.weight / sum;
                const generatedItem = {
                    value: item.value,
                    weight: item.weight,
                    p: p,
                    min: last,
                    max: last + p
                };
                if (i === items.length - 1)
                    generatedItem.max = 1; // avoids stupid problems
                generatedItems.push(generatedItem);
                last = generatedItem.max;
            }
            return generatedItems;
        }
        /**
         * Roll a random item.
         * @param p Provide a roll generated externally.
         * @returns {T}
         */
        roll(p) {
            const seed = p || Math.random();
            for (let item of this.items)
                if (item.min <= seed && seed <= item.max)
                    return item.value;
            throw new Error("your P value or your item list are fucked");
        }
    }
    exports.PTable = PTable;
});
//# sourceMappingURL=ptable.js.map