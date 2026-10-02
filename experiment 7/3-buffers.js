// Buffers: run with "node 3-buffers.js"
const buf1 = Buffer.from("LeafLog");
console.log("Buffer:", buf1);
console.log("As string:", buf1.toString());
console.log("Length:", buf1.length);
console.log("Hex:", buf1.toString("hex"));
console.log("Base64:", buf1.toString("base64"));

const buf2 = Buffer.alloc(5);        // 5 empty bytes
buf2.write("Hi");
console.log("Alloc buffer:", buf2);

const joined = Buffer.concat([buf1, Buffer.from(" App")]);
console.log("Concat:", joined.toString());

console.log("First byte:", buf1[0], "=", String.fromCharCode(buf1[0]));
console.log("Slice:", buf1.slice(0, 4).toString());
