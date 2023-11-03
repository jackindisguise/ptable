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
        weight: 2 // 50%
    },
    {
        value: "pie",
        weight: 1 // 25%
    },
    {
        value: "ice-cream",
        weight: 1 // 25%
    }
]);

const result = dessert.roll();
assert(["cake", "pie", "ice-cream"].includes(result)); // will be one of these 3, you know
// can't really capture the probability differences without a unit test. x(
```
Relative weights are summed and then compared against to generated a P value.

The above code generates a PTable that internally looks like this:
```javascript
PTable {
  items: [
    {
      value: 'cake',
      weight: 2,
      p: 0.5,
      min: 0,
      max: 0.5
    },
    {
      value: 'pie',
      weight: 1,
      p: 0.25,
      min: 0.5
      max: 0.75
    },
    {
      value: 'ice-cream',
      weight: 1,
      p: 0.25
      min: 0.75
      max: 1
    }
  ]
}
```
Internally, the `roll` function will roll a random number using `Math.random()`, and then compare the result with the ranges of each item (`min`\~`max`).

If a roll falls into an item's range, it will be returned.

## Use an externally-generated roll value.
```javascript
const dessert = new PTable<string>([
    {
        value: "cake",
        weight: 2 // 50%
    },
    {
        value: "pie",
        weight: 1 // 25%
    },
    {
        value: "ice-cream",
        weight: 1 // 25%
    }
]);

const result = dessert.roll(0.25);
assert(result === "cake"); // 0~0.5 will always be cake
```