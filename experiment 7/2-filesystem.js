// File System: run with "node 2-filesystem.js"
const fs = require("fs");

// 1. Write a file
fs.writeFileSync("plants.txt", "Tulsi\nAloe Vera\n");
console.log("1. File created");

// 2. Append to the file
fs.appendFileSync("plants.txt", "Money Plant\n");
console.log("2. Data appended");

// 3. Read the file (synchronous)
const data = fs.readFileSync("plants.txt", "utf8");
console.log("3. File content:\n" + data);

// 4. Read the file (asynchronous)
fs.readFile("plants.txt", "utf8", (err, content) => {
  if (err) return console.log("Error:", err.message);
  console.log("4. Async read, total lines:", content.trim().split("\n").length);

  // 5. Rename then delete
  fs.renameSync("plants.txt", "plants-old.txt");
  console.log("5. File renamed");
  fs.unlinkSync("plants-old.txt");
  console.log("6. File deleted");
});

console.log("(This line prints before the async read finishes)");
