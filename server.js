const http = require("http");

const server = http.createServer((req, res) => {
  res.end(":)");
});

server.listen(process.env.PORT || 3001);
