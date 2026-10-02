// Event Loop + EventEmitter: run with "node 5-eventloop.js"
const EventEmitter = require("events");
const fs = require("fs");

console.log("1. Start (synchronous)");

setTimeout(() => console.log("5. setTimeout 0ms (timers phase)"), 0);
setImmediate(() => console.log("6. setImmediate (check phase)"));
fs.readFile(__filename, () => console.log("7. File read callback (I/O)"));
Promise.resolve().then(() => console.log("4. Promise (microtask)"));
process.nextTick(() => console.log("3. process.nextTick (runs first after sync code)"));

console.log("2. End (synchronous)");

// EventEmitter
const emitter = new EventEmitter();
emitter.on("watered", (plant) => console.log(`Event: ${plant} has been watered`));
emitter.once("first", () => console.log("Event: this runs only once"));

setTimeout(() => {
  emitter.emit("watered", "Tulsi");
  emitter.emit("watered", "Aloe Vera");
  emitter.emit("first");
  emitter.emit("first");   // nothing happens the second time
}, 100);
