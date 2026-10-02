// HTTP Server: run with "node 1-server.js", then open http://localhost:3000
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>LeafLog Server</h1><p>Node.js HTTP server is running.</p>");
  } else if (req.url === "/plants") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ name: "Tulsi", every: 2 }, { name: "Aloe Vera", every: 7 }]));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page not found");
  }
});

server.listen(3000, () => console.log("Server running at http://localhost:3000 (Ctrl+C to stop)"));
