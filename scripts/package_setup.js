const fs = require("node:fs");
const path = require("node:path");

const dir = path.join(__dirname, "../packageDist"); // Define the directory path

// Use synchronous mkdir with recursive option to ensure directory exists
try {
	fs.mkdirSync(dir, { recursive: true });
} catch (err) {
	console.error(`Error creating directory: ${err}`);
	process.exit(1); // Exit with an error code if creation fails
}
