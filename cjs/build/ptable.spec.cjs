(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ptable.cjs", "chai"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ptable_1 = require("./ptable.cjs");
    const chai_1 = require("chai");
    describe("ptable.ts", () => {
        it("uniform distribution", (done) => {
            const ptable = new ptable_1.PTable();
            // populate table with items
            ptable.create("cake", 2 / 5);
            ptable.create("pie", 1 / 5);
            ptable.create("ice cream", 1 / 5);
            ptable.create("cookie", 1 / 5);
            // roll and track results
            const attempts = 100000;
            const results = {};
            for (let i = 0; i < attempts; i++) {
                const result = ptable.roll();
                if (results[result])
                    results[result]++;
                else
                    results[result] = 1;
            }
            // check results against expected P values for items
            for (let item of ptable.items) {
                const realP = results[item.value] / attempts;
                (0, chai_1.expect)(realP).is.within(item.p * 0.95, item.p * 1.05); // real distribution is within 5% of expected distribution
            }
            done();
        });
    });
});
