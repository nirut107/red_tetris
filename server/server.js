const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const Game = require("./game/Game");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const games = new Map(); // room -> Game

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_game", ({ room, name }) => {
    if (!games.has(room)) {
      games.set(room, new Game(room, io));
    }

    const game = games.get(room);
    game.addPlayer(socket, name);
    game.start();
  });

  socket.on("start_game", () => {
    const game = findGameBySocket(socket.id);
    if (game) game.start();
  });

  socket.on("move_left", () => handleInput(socket, "left"));
  socket.on("move_right", () => handleInput(socket, "right"));
  socket.on("rotate", () => handleInput(socket, "rotate"));
  socket.on("soft_drop", () => handleInput(socket, "down"));
  socket.on("hard_drop", () => handleInput(socket, "hard_drop"));

  socket.on("disconnect", () => {
    const game = findGameBySocket(socket.id);
    if (game) game.removePlayer(socket.id);
  });

  function handleInput(socket, action) {
    const game = findGameBySocket(socket.id);
    if (game) game.handleInput(socket.id, action);
  }

  function findGameBySocket(socketId) {
    for (const game of games.values()) {
      if (game.hasPlayer(socketId)) return game;
    }
    return null;
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
