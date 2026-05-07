const Player = require("./Player");
const Piece = require("./Piece");
const { createBoard, randomPiece } = require("./utils");

class Game {
  constructor(room, io) {
    this.room = room;
    this.io = io;
    this.players = new Map(); // socketId -> Player
    this.host = null;

    this.interval = null;
    this.running = false;

    this.pieceQueue = [];
  }

  addPlayer(socket, name) {
    const player = new Player(socket.id, name);

    this.players.set(socket.id, player);
    socket.join(this.room);

    if (!this.host) this.host = socket.id;
    if (this.running) player.spawnPiece(this.nextPiece.bind(this));

    this.broadcast();
  }

  removePlayer(socketId) {
    this.players.delete(socketId);

    if (this.host === socketId) {
      this.host = [...this.players.keys()][0] || null;
    }

    if (this.players.size === 0) {
      clearInterval(this.interval);
    }

    this.broadcast();
  }

  hasPlayer(socketId) {
    return this.players.has(socketId);
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.generatePieces();

    for (const player of this.players.values()) {
      player.spawnPiece(this.nextPiece.bind(this));
    }

    this.broadcast();

    this.interval = setInterval(() => this.tick(), 500);
  }

  generatePieces() {
    this.pieceQueue = Array.from({ length: 100 }, () => randomPiece());
  }

  nextPiece() {
    if (this.pieceQueue.length === 0) this.generatePieces();
    return new Piece(this.pieceQueue.shift());
  }

  tick() {
    for (const player of this.players.values()) {
      player.update(this.nextPiece.bind(this));
    }

    this.broadcast();
  }

  handleInput(socketId, action) {
    const player = this.players.get(socketId);
    if (!player) return;

    player.handleInput(action);
    this.broadcast();
  }

  broadcast() {
    const state = {
      players: [...this.players.values()].map((p) => p.serialize()),
      host: this.host,
      running: this.running,
    };

    this.io.to(this.room).emit("game_state", state);
  }
}

module.exports = Game;
