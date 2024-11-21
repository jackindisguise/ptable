import { PTable } from "./ptable";
var AttackOutcome;
(function (AttackOutcome) {
    AttackOutcome[AttackOutcome["MISS"] = 0] = "MISS";
    AttackOutcome[AttackOutcome["PARRY"] = 1] = "PARRY";
    AttackOutcome[AttackOutcome["DODGE"] = 2] = "DODGE";
    AttackOutcome[AttackOutcome["BLOCK"] = 3] = "BLOCK";
    AttackOutcome[AttackOutcome["HIT"] = 4] = "HIT";
    AttackOutcome[AttackOutcome["CRITICAL"] = 5] = "CRITICAL";
    AttackOutcome[AttackOutcome["GLANCING"] = 6] = "GLANCING";
})(AttackOutcome || (AttackOutcome = {}));
const p = new PTable();
p.populate(() => {
    p.create(AttackOutcome.MISS, 1);
    p.create(AttackOutcome.PARRY, 1);
    p.create(AttackOutcome.DODGE, 1);
    p.create(AttackOutcome.BLOCK, 1);
    p.create(AttackOutcome.HIT, 4);
    p.create(AttackOutcome.CRITICAL, 2);
    p.create(AttackOutcome.GLANCING, 1);
});
for (let i = 0; i < 1000; i++) {
    console.log(AttackOutcome[p.roll()]);
}
