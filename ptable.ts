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
	items: PTableItem<T>[] = [];
	private weightSum: number = 0;
	constructor(items?: PTableItemPre<T>[]){
		if(items) this.add(...items);
	}

	/**
	 * Create an item and add it to our item list.
	 * Updates the roll values.
	 * @param value
	 * @param weight
	 */
	create(value: T, weight: number){
		this.add({value: value, weight:weight});
	}

	/**
	 * Adds items to our item list.
	 * Updates the roll values.
	 * @param items 
	 */
	add(...items: PTableItemPre<T>[]){
		for(let item of items){
			this.items.push({
				value: item.value,
				weight: item.weight,
				p: 0,
				min: 0,
				max: 0
			});
			this.weightSum += item.weight;
		}
		this.update();
	}

	/**
	 * Update roll values for items.
	 */
	private update(){
		let last = 0;
		for(let i=0;i<this.items.length;i++) {
			const item = this.items[i];
			const p = item.weight/this.weightSum;
			item.p = p;
			item.min = last;
			item.max = last+p;
			if(i===this.items.length-1) item.max = 1; // avoids stupid problems
			last = item.max;
		}
	}

	/**
	 * Roll a random item.
	 * @param p Provide a roll generated externally.
	 * @returns {T}
	 */
	roll(p?: number): T{
		const seed = p||Math.random();
		for(let item of this.items) if(item.min <= seed && seed <= item.max) return item.value;
		throw new Error("your P values are fricken messed up bro");
	}
}