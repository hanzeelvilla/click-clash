const EventEmitter = require("events");

class GameManager extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.target = Number(opts.target) || 10;
    this.state = "waiting"; // waiting | playing | finished
    this.winner = null;
    // players: map of id -> { id, label, count }
    this.players = {};
  }

  addPlayer(player) {
    this.players[player.id] = Object.assign({ count: 0 }, player);
    this.emitState();
  }

  setTarget(n) {
    this.target = Number(n) || this.target;
    this.emitState();
  }

  start() {
    if (this.state === "playing") return;
    // reset counts when starting
    Object.values(this.players).forEach((p) => (p.count = 0));
    this.winner = null;
    this.state = "playing";
    this.emitState();
  }

  reset() {
    Object.values(this.players).forEach((p) => (p.count = 0));
    this.winner = null;
    this.state = "waiting";
    this.emitState();
  }

  handlePress(playerId) {
    if (this.state !== "playing") return;
    const p = this.players[playerId];
    if (!p) return;

    p.count += 1;
    this.emit("player:update", { id: p.id, count: p.count });

    if (p.count >= this.target) {
      this.winner = p.id;
      this.state = "finished";
      this.emit("game:win", { winner: p.id, count: p.count });
    }

    this.emitState();
  }

  getState() {
    return {
      state: this.state,
      target: this.target,
      players: Object.values(this.players).map((p) => ({
        id: p.id,
        label: p.label,
        count: p.count,
      })),
      winner: this.winner,
    };
  }

  emitState() {
    this.emit("game:state", this.getState());
  }
}

module.exports = GameManager;
