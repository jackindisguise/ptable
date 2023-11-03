const fs = require("fs");
console.log("converting CJS exports to .cjs");
fs.readdir("build", (err, files) => {
	if (err) return;
	for (let file of files) {
		if (file.indexOf(".js") === -1) continue;
		fs.readFile("build/" + file, "utf8", (err, data) => {
			if (err) return;
			let newPath = file.slice(0, file.lastIndexOf(".js")) + ".cjs";
			let fixed = data;
			for (let _file of files) {
				// find all our .js files
				if (_file.indexOf(".js") === -1) continue;
				// replace any potential references to the file with references to the new file
				let extensionless = _file.slice(0, _file.indexOf(".js"));
				fixed = fixed.replaceAll(
					`./${extensionless}`,
					`./${extensionless}.cjs`
				); // replace all includes with .cjs extension
			}
			fs.writeFile("build/" + newPath, fixed, (err) => {
				if (err) return;
				//console.log(`generated ${newPath} from ${file}`);
				fs.rm("build/" + file, (err) => {
					if (err) return;
					//console.log(`deleted ${file}`);
				});
			});
		});
	}
});
