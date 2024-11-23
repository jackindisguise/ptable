import { expect } from "chai";
import { PTable } from "./ptable.js";
describe("ptable", () => {
    describe("PTable", () => {
        it("basic functionality", (done) => {
            // generate a simple PTable
            const p = new PTable();
            // option => option weight
            // in this example we're supplying the exact distribution of P values as the weight
            const options = {
                a: 0.5,
                b: 0.49,
                c: 0.009,
                d: 0.0009,
                e: 0.00009,
                f: 0.000009,
                g: 0.000001,
            };
            // use populate for good measure
            p.populate(() => {
                for (let key in options)
                    p.create(key, options[key]);
            });
            // roll a few times and store the distribution of results
            const distribution = new Map();
            const cycles = 2e8;
            for (let i = 0; i < cycles; i++) {
                const result = p.roll();
                distribution.set(result, (distribution.get(result) || 0) + 1);
            }
            // check distribution of each option with 10% margin of error
            for (let key in options) {
                const results = distribution.get(key) || 0;
                const ratio = results / cycles;
                expect(ratio).is.within(options[key] * 0.95, options[key] * 1.05);
            }
            done();
        }).timeout(0);
    });
});
