"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// build/ptable.js
var ptable_exports = {};
__export(ptable_exports, {
  EmptyPTableError: () => EmptyPTableError,
  LARGEST_VALID_RANGE: () => LARGEST_VALID_RANGE,
  NoResultError: () => NoResultError,
  PTable: () => PTable,
  SMALLEST_VALID_RANGE: () => SMALLEST_VALID_RANGE
});
module.exports = __toCommonJS(ptable_exports);
var LARGEST_VALID_RANGE = 0.999999999;
var SMALLEST_VALID_RANGE = 1e-9;
var PTable = class {
  constructor() {
    this.editMode = false;
    this.totalWeight = 0;
    this.entries = [];
  }
  /**
   * Add a series of entries to the PTable.
   *
   * After adding all entries, the probability ranges will be re-intialized for all entries
   * based on the change in the total weight of all entries added.
   *
   * When adding lots of entries, you may want to look into {@link PTable#populate}.
   * @see {@link PTable#populate}
   * @param entries The set of precursor PTable entries to add.
   */
  add(...entries) {
    for (let entry of entries) {
      this.totalWeight += entry.weight;
      this.entries.push({
        value: entry.value,
        weight: entry.weight,
        relativeWeight: 0,
        low: 0,
        high: 0
      });
    }
    if (!this.editMode)
      this.initializeEntryRanges();
  }
  /**
   * Create a new PTable entry.
   * @param value The value of the entry.
   * @param weight The weight of the entry.
   */
  create(value, weight) {
    this.add({ value, weight });
  }
  /**
   * Enables edit mode, which disables re-initializing entry ranges with every addition.
   *
   * Edit mode is only enabled during the call of the provided callback function, which is executed immediately.
   *
   * After the callback function ends, edit mode is disabled.
   * @param edit A function called during edit mode.
   */
  populate(edit) {
    this.editMode = true;
    edit();
    this.editMode = false;
    this.initializeEntryRanges();
  }
  /**
   * Re-calculates the ranges of all entries based on their weights.
   *
   * Called every time a new entry is added, unless edit mode is enabled.
   * @see {@link PTable#populate}
   */
  initializeEntryRanges() {
    let previous = 0;
    for (let entry of this.entries) {
      let range = entry.weight / this.totalWeight;
      entry.low = previous;
      entry.high = previous + range;
      if (entry.low == entry.high || entry.low == 1)
        throw new Error(`PTable entry range is impossible: ${entry.low} -> ${entry.high}`);
      entry.relativeWeight = range;
      previous = entry.high;
    }
  }
  /**
   * Generate a random number to use to pick an entry from the table.
   * @returns The rolled entry's value.
   * @throws {EmptyPTableError} Attempting to roll an empty PTable.
   * @throws {NoResultError} Failed to return a result. This generally means the provided P value is not within the range of any entries.
   */
  roll() {
    return this.preroll(Math.random());
  }
  /**
   * Accepts a P value between 0 and 1 that corresponds to the range of an entry in the PTable.
   *
   * If the p value falls within the range of the entry, its value will be returned.
   * @param p A value between 0 and 1.
   * @returns The value of the chosen entry.
   * @throws {EmptyPTableError} Attempting to roll an empty PTable.
   * @throws {NoResultError} Failed to return a result. This generally means the provided P value is not within the range of any entries.
   */
  preroll(p) {
    if (this.entries.length < 1)
      throw new EmptyPTableError("attempting to roll empty PTable.");
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (p >= entry.low && p <= entry.high)
        return entry.value;
    }
    throw new NoResultError("failed to produce result in PTable roll");
  }
};
var EmptyPTableError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EmptyPTableError";
  }
};
var NoResultError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "NoResultError";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmptyPTableError,
  LARGEST_VALID_RANGE,
  NoResultError,
  PTable,
  SMALLEST_VALID_RANGE
});
