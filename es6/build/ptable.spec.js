import { PTable } from "./ptable.js";
import { expect } from "chai";
describe("ptable.ts", () => {
    it("uniform distribution", (done) => {
        const ptable = new PTable([
            {
                value: "cake",
                weight: 0.5
            },
            {
                value: "pie",
                weight: 0.25
            },
            {
                value: "ice-cream",
                weight: 0.25
            }
        ]);
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
//# sourceMappingURL=ptable.spec.js.map