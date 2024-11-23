const { PTable } = require("./build/ptable.cjs");
const cycles = 30000;

console.log(`${cycles} cycles:`);
{
	const p = new PTable();
	const start = Date.now();
	for (let i = 0; i < cycles; i++) {
		p.create(`#${i}`, cycles - i);
	}
	const end = Date.now();
	console.log(`No populate(): ${end - start} milliseconds`);
	console.log(p.roll());
}

{
	const p = new PTable();
	const start = Date.now();
	p.populate(() => {
		for (let i = 0; i < cycles; i++) {
			p.create(`#${i}`, cycles - i);
		}
	});
	const end = Date.now();
	console.log(`   populate(): ${end - start} milliseconds`);
	console.log(p.roll());
}
