const EventEmitter = require("events");
const { Board, Button } = require("johnny-five");

class BoardManager extends EventEmitter {
  /**
   * opts: { players: [{id, label, port?}], simulate: boolean }
   */
  constructor(opts = {}) {
    super();
    this.players = opts.players || [
      { id: "p1", label: "Player 1" },
      { id: "p2", label: "Player 2" },
    ];
    this.simulate = !!opts.simulate;
    this.boards = {}; // playerId -> board/button
  }

  async init() {
    if (this.simulate) {
      // no hardware: provide simple API to simulate presses
      this.players.forEach((p) => this.emit("board:ready", p));
      return;
    }

    // Try to create a johnny-five Board for each player.
    this.players.forEach((p) => {
      try {
        const board = new Board({ port: p.port });
        board.on("ready", () => {
          const button = new Button({ pin: 2, board });
          button.on("press", () => this.emit("press", p.id));
          this.boards[p.id] = { board, button };
          this.emit("board:ready", p);
        });
        board.on("error", (err) =>
          this.emit("board:error", { player: p.id, error: err })
        );
      } catch (err) {
        this.emit("board:error", { player: p.id, error: err });
      }
    });
  }

  // Simulate a press (useful for testing when simulate=true)
  simulatePress(playerId) {
    if (!this.simulate) return;
    this.emit("press", playerId);
  }
}

module.exports = BoardManager;
