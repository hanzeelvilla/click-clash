const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const GameManager = require("./lib/GameManager");
const BoardManager = require("./lib/BoardManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Config: allow simulate via env SIMULATE=true
const simulate = process.env.SIMULATE === "true";

const players = [
  { id: "p1", label: "Player 1", port: process.env.P1_PORT },
  { id: "p2", label: "Player 2", port: process.env.P2_PORT },
];

const game = new GameManager({ target: process.env.TARGET || 10 });
const boards = new BoardManager({ players, simulate });

// register players in game manager
players.forEach((p) => game.addPlayer({ id: p.id, label: p.label }));

// board -> game wiring
boards.on("press", (playerId) => {
  game.handlePress(playerId);
});

boards.on("board:ready", (p) => console.log("Board ready:", p.id));
boards.on("board:error", (err) => console.error("Board error:", err));

game.on("game:state", (state) => io.emit("game:state", state));
game.on("player:update", (u) => io.emit("player:update", u));
game.on("game:win", (w) => io.emit("game:win", w));

io.on("connection", (socket) => {
  // send full state on connect
  socket.emit("game:state", game.getState());

  socket.on("game:start", () => game.start());
  socket.on("game:reset", () => game.reset());
  socket.on("game:setTarget", (n) => game.setTarget(n));

  // client can request simulated presses (if server in simulate mode)
  socket.on("simulate:press", (playerId) => {
    boards.simulatePress(playerId);
  });
});

// initialize boards
boards.init();

// Start server
const PORT = process.env.PORT || 3000;
// handle listen errors (EADDRINUSE etc.) with a friendly message
server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Is another instance running?`
    );
    console.error(
      "If so, stop it or set a different PORT, e.g. PORT=4000 npm run start"
    );
    process.exit(1);
  }
  console.error("Server error:", err);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(
    `Server listening on http://localhost:${PORT} (simulate=${simulate})`
  );
});
