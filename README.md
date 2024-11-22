<div align='center'>
	
[![Static Badge](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/jackindisguise/ptable)
[![Static Badge](https://img.shields.io/badge/Documentation-orange?logo=github)](https://jackindisguise.github.io/ptable/)

</div>

# PTable
A PTable ("**P**robability **Table**") is a set of items that have an assigned probability.

The goal of the probability table is to make it quick and easy to assign a set chance to multiple outcomes of a single event.

# Example
```TypeScript
import {PTable} from "ptable";
const p = new PTable<string>();
p.add({value: "blah", weight: 1}); // add an entry for the string "blah" with a weight of 1
p.create("cake", 2); // shortcut for adding a string "cake" with a weight of 2
p.create("pie", 5);

for(let i=0;i<10000;i++){
	const result = p.roll();
}
// ...
```

# Distribution
The distribution of 10,000 cycles might look something like this:

| result | count | chance | ratio |
|:------:|:-----:|:------:|:-----:|
| pie    | 6251  | 62.51% | 5/8~  |
| cake   | 2511  | 25.11% | 2/8~  |
| blah   | 1238  | 12.38% | 1/8~  |

# Weights
Weights are relative to all other entries in the `PTable`. The weight of all of the entries in the example PTable when combined is `8`. That means `"blah"`, with a weight of `1`, has a `1/8` chance of being rolled on average.

If you have a set of weights that looks like `[1,1,1,1]`, each item in the set will have a 1/4 (25%) share of all P values. On the flipside, you could also use `[0.25, 0.25, 0.25, 0.25]` to represent the same share of P values. As long as they all share the same weight, they will all have an equal share of the P values.

# Populate
Whenever you add an entry to the PTable, the ranges for each entry are re-calculated based on the new total weight of all entries.

In order to avoid this behavior (for lots of insertions, for example), you can use the `populate()` function.

```TypeScript
const p = new PTable<string>();
p.populate(()=>{
    p.create("1", 1);
    p.create("2", 1);
    p.create("3", 1);
    p.create("4", 1);
    p.create("5", 1);
    p.create("6", 1);
    p.create("7", 1);
    p.create("8", 1);
    p.create("9", 1);
    p.create("10", 1);
});
```

`populate()` enables "edit mode," which just temporarily disables re-calculation on adding new entries. The provided callback is executed while "edit mode" is enabled, and it is immediately disabled after the callback is called, and ranges will be re-calculated. Even if nothing has changed.

This approach allows me to avoid exposing the "edit mode" option to the user space, and it allows me to avoid adding extra options to the `add()` and `create()` methods. There will never be a case where things are added that aren't accounted for, and there will never be a case where the state of the PTable is unpredictable. If you aren't using `populate()`, all additions will re-initialize. If you are using `populate()`, no additions will re-initialize.

# Supports CJS and ESM
## CJS
```JavaScript
const {PTable} = require("ptable");
const p = new PTable();
p.add({value: "blah", weight: 1}); // add an entry for the string "blah" with a weight of 1
p.create("cake", 2); // shortcut for adding a string "cake" with a weight of 2
p.create("pie", 5);

for(let i=0;i<10000;i++){
	const result = p.roll();
}
```

## ESM
```JavaScript
import {PTable} from "ptable";
const p = new PTable();
p.add({value: "blah", weight: 1}); // add an entry for the string "blah" with a weight of 1
p.create("cake", 2); // shortcut for adding a string "cake" with a weight of 2
p.create("pie", 5);

for(let i=0;i<10000;i++){
	const result = p.roll();
}
// ...
```