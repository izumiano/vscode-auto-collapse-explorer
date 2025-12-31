const fs = require("node:fs/promises");
const path = require("node:path");

async function getFirstFile(dirPath) {
	try {
		// Read directory contents (returns an array of names)
		const files = await fs.readdir(dirPath);

		// Filter out directories to only get files (optional, but often necessary)
		const fileStats = await Promise.all(
			files.map(async (file) => {
				const fullPath = path.join(dirPath, file);
				const stat = await fs.stat(fullPath);
				return { name: file, isFile: stat.isFile() };
			}),
		);

		const actualFiles = fileStats
			.filter((item) => item.isFile)
			.map((item) => item.name);

		if (actualFiles.length > 0) {
			// The array is sorted alphabetically by default
			return actualFiles[0];
		} else {
			return "No files found in the directory.";
		}
	} catch (err) {
		console.error("Error reading directory:", err);
		throw err;
	}
}

async function renameFile(oldPath, newPath) {
	try {
		await fs.rename(oldPath, newPath);
		console.log(`File renamed successfully from ${oldPath} to ${newPath}`);
	} catch (error) {
		console.error("Error renaming file:", error);
	}
}

const dir = "./packageDist";

if (process.argv.length >= 3) {
	// Example usage
	getFirstFile(dir)
		.then((fileName) => {
			const dotIndex = fileName.lastIndexOf(".");
			const newName = `${fileName.slice(0, dotIndex)}-${process.argv[2]}.vsix`;

			renameFile(`${dir}/${fileName}`, `${dir}/${newName}`);
		})
		.catch((err) => console.error(err));
}
