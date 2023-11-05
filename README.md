[![npm](https://img.shields.io/npm/v/jid-ptable)](https://www.npmjs.com/package/jid-ptable)
[![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/jackindisguise/ptable/main)](https://github.com/jackindisguise/ptable)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/jackindisguise/ptable/main)
# About
Provides a structured method of picking between multiple options at random with an expected distribution.

A simple solution to this problem might resemble the following:
```javascript
const chance = Math.random();
if(chance <= 0.25) // 25% miss rate (0 <= chance <= 0.25)
	console.log("miss")
else // 75% hit rate (.25 < chance <= 1)
	console.log("hit");
```

This is not exactly scalable, especially when there are many options `...`
```javascript
const chance = Math.random();
if(chance <= 0.1) // 10% miss rate (0 <= chance <= 0.1)
	console.log("miss")
else if(chance <= 0.2) // 10% evasion rate (0.1 < chance <= 0.2)
	console.log("evade")
else if(chance <= 0.25) // 5% parry rate (0.2 < chance <= 0.25)
	console.log("parry")
else if(chance <= 0.5) // 25% glancing blow rate (0.25 < chance <= 0.5)
	console.log("glancing blow")
else if(chance <= 0.75) // 25% hit rate (0.5 < chance <= 0.75)
	console.log("hit");
else // 25% crit rate (0.75 < chance <= 1)
	console.log("critical hit");
```
`...` or you have a need to repeat this operation a lot.

This package provides a scalable solution that requires less on-the-fly math.
```javascript
const {PTable} = require("jid-ptable");

// prepare the table
const ptable = new PTable();
ptable.create("miss", 10/100); // 25% non-hit rate
ptable.create("evade", 10/100);
ptable.create("parry", 5/100);
ptable.create("glancing blow", 25/100); // 75% hit rate
ptable.create("hit", 25/100);
ptable.create("critical hit", 25/100);

// roll an item
const result = ptable.roll();
// do something...
```
# Compatibility
Supports both CJS and ES6 import style.
```javascript
// CommonJS-style
const {PTable} = require("jid-ptable");

// ES6 module-style
import {PTable} from "jid-ptable";
```
# Install
`npm i jid-ptable`
# Features
## Pick from a list of items at random!
```javascript
const dessert = new PTable([
    {
        value: "cake",
        weight: 2 // 2/4 == 50%
    },
    {
        value: "pie",
        weight: 1 // 1/4 === 25%
    },
    {
        value: "ice cream",
        weight: 1 // 1/4 === 25%
    }
]);

const result = dessert.roll();
assert(["cake", "pie", "ice cream"].includes(result));
```
Item weights are summed and then compared to generate a P value. This means you can use any positive number as a weight, whether it be integers or fractions.

The above code generates a `PTable` that internally looks like this:
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
      value: 'ice cream',
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
## Distribution
The real distribution of this table over 1 million rolls looks something like:

| Result       | Distribution |
|:-----------:|:---:|
| cake | 49.98% |
| ice cream | 24.99% |
| pie | 25.01% |

It will ideally converge with the `p` value of the item.
## Use an externally-generated roll value.
```javascript
const dessert = new PTable();

// create a new item and add it!
dessert.create("cake", 33/100);
dessert.create("pie", 33/100);
dessert.create("ice cream", 33/100);

const notRNG = 0.2;
const result = dessert.roll(notRNG);
assert(result === "cake"); // 0~0.334 will always be cake
```
## Populate PTables post-creation.
```javascript
const hitTable = new PTable();

// create an item on the fly and add it to the table
hitTable.create("hit", 0.50); // 50% regular hits

// add items in bulk if necessary
hitTable.add([
	{value: "critical hit", weight: 0.25}, // 25% critical hits
	{value: "miss", weight: 0.25} // 25% miss rate
);

// hit test
const result = hitTable.roll();
console.log(`It's a ${result}!`);
```