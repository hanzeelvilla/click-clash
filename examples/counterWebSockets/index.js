const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Board, Button } = require("johnny-five");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

const board = new Board();

board.on("ready", () => {
  let count = 0;

  const button = new Button(2);

  console.log(`Count: ${count}`);
  console.log("Press the button to increment the counter.");

  // When a client connects, send the current count
  io.on("connection", (socket) => {
    socket.emit("count", count);
  });

  button.on("press", () => {

    count += 1;
    console.log(`Button pressed ${count} times`);
    // emit to all connected clients
    io.emit("count", count);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
