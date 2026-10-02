// Streams: run with "node 4-streams.js"
const fs = require("fs");

// Create a sample file first
let text = "";
for (let i = 1; i <= 2000; i++) text += `Line ${i}: watering log entry\n`;
fs.writeFileSync("big.txt", text);

// Readable stream (small chunks so we can see several)
const reader = fs.createReadStream("big.txt", { encoding: "utf8", highWaterMark: 16 * 1024 });
const writer = fs.createWriteStream("copy.txt");

let chunks = 0;
reader.on("data", (chunk) => {
  chunks++;
  console.log(`Chunk ${chunks} received, size: ${chunk.length} chars`);
  writer.write(chunk);
});

reader.on("end", () => {
  writer.end();
  console.log("Reading finished. Total chunks:", chunks);
});

writer.on("finish", () => {
  console.log("Writing finished. copy.txt created");
  // pipe example
  fs.createReadStream("big.txt").pipe(fs.createWriteStream("piped.txt"))
    .on("finish", () => console.log("pipe() copy finished, piped.txt created"));
});

reader.on("error", (err) => console.log("Error:", err.message));
