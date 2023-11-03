[![npm](https://img.shields.io/npm/v/jid-ptable)](https://www.npmjs.com/package/jid-ptable)
[![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/jackindisguise/ptable/main)](https://github.com/jackindisguise/ptable)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/jackindisguise/ptable/main)
# About
Provides a simple method of picking between multiple options at random with an expected distribution.
# Compatibility
Supports both CJS and ES6 import style.
```javascript
// CommonJS-style
const {PTable} = require("jid-ptable");

// ES6 module-style
import {PTable} from "jid-ptable";
```
# Install
`npm i ptable`
# Features
## Pick from a list of items at random!

```javascript
const dessert = new PTable<string>([
    {
        value: "cake",
        weight: 2/5
    },
    {
        value: "pie",
        weight: 1/5
    },
    {
        value: "ice cream",
        weight: 1/5
    }
]);

// add an existing item!
dessert.add({value:"cookie", weight:1/5});

const result = dessert.roll();
assert(["cake", "pie", "ice cream", "cookie"].includes(result)); // will be one of these 3, you know
// can't really capture the probability differences without a unit test. x(
```
Relative weights are summed and then compared against to generated a P value.

The above code generates a PTable that internally looks like this:
```javascript
PTable {
  items: [
    {
      value: 'cake',
      weight: 0.4,
      p: 0.4,
      min: 0,
      max: 0.4
    },
    {
      value: 'pie',
      weight: 0.2,
      p: 0.2,
      min: 0.4
      max: 0.6
    },
    {
      value: 'ice cream',
      weight: 0.2,
      p: 0.2
      min: 0.6
      max: 0.8
    },
    {
      value: 'cookie',
      weight: 0.2,
      p: 0.2
      min: 0.8
      max: 1
    }
  ]
}
```
Internally, the `roll` function will roll a random number using `Math.random()`, and then compare the result with the ranges of each item (`min`\~`max`).

If a roll falls into an item's range, it will be returned.

## Use an externally-generated roll value.
```javascript
const dessert = new PTable<string>();

// create a new item and add it!
dessert.create("cake", 2/4);
dessert.create("pie", 1/4);
dessert.create("ice cream", 1/4);

const notRNG = 0.25;
const result = dessert.roll(notRNG);
assert(result === "cake"); // 0~0.5 will always be cake
```