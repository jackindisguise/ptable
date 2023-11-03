import { PTable } from "./ptable.mjs";
import { expect } from "chai";
describe("ptable.ts", () => {
    it("uniform distribution", (done) => {
        const ptable = new PTable();
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
            expect(realP).is.within(item.p * 0.95, item.p * 1.05); // real distribution is within 5% of expected distribution
        }
        done();
    });
});
