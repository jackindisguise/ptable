/**
 * The skeleton of a PTableItem.
 * Provides the value that'll be returned when the item is rolled as well as the weight for the item.
 * These items are used by a PTable to generate an array of PTableItems for the purpose of rolling.
 */
export interface PTableItemPre<T> {
	/** The value returned when the item is rolled. */
	value: T;

	/** The relative weight of the item. */
	weight: number;
}

/**
 * The items rolled by a PTable.
 */
export interface PTableItem<T> extends PTableItemPre<T>{
	p: number;
	min: number;
	max: number;
}

/**
 * Provides a standardized method of picking from a list of options based on RNG.
 */
export class PTable<T>{
	/** The items that this table can roll. */
	items: PTableItem<T>[];
	constructor(items: PTableItemPre<T>[]){
		this.items = this.prepare(items);
	}

	/**
	 * Prepare generic pre-items for use with the PTable.
	 * @param items 
	 */
	private prepare(items: PTableItemPre<T>[]): PTableItem<T>[]{
		// generate sum for P values
		let sum = 0;
		for(let item of items) sum += item.weight;

		// generate P values and ranges
		let last = 0;
		const generatedItems: PTableItem<T>[] = [];
		for(let i=0;i<items.length;i++) {
			const item = items[i];
			const p = item.weight/sum;
			const generatedItem: PTableItem<T> = {
				value: item.value,
				weight: item.weight,
				p: p,
				min: last,
				max: last+p
			};
			if(i===items.length-1) generatedItem.max = 1; // avoids stupid problems
			generatedItems.push(generatedItem);
			last = generatedItem.max;
		}

		return generatedItems;
	}

	/**
	 * Roll a random item.
	 * @param p Provide a roll generated externally.
	 * @returns {T}
	 */
	roll(p?: number): T{
		const seed = p||Math.random();
		for(let item of this.items) if(item.min <= seed && seed <= item.max) return item.value;
		throw new Error("your P value or your item list are fucked");
	}
}