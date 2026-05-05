const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let board = createBoard();

function createBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

function drawBoard() {
  const newBoard = board.map(row => [...row]);

  newBoard[piece.y][piece.x] = 1;

  return newBoard;
}

const piece = {
  shape: [[1]],
  x: 4,
  y: 0,
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_game", (data) => {
    console.log("JOIN GAME:", data);
    socket.emit("game_state", {
      status: "playing",
      board: createBoard(),
    });
    setInterval(() => {
      gameTick();
    }, 500);
  });

  socket.on("start_game", () => {
    console.log("START GAME");
  });

  socket.on("move_left", () => {
    console.log("MOVE LEFT");
  });

  socket.on("move_right", () => {
    console.log("MOVE RIGHT");
  });

  socket.on("rotate", () => {
    console.log("ROTATE");
  });

  socket.on("soft_drop", () => {
    console.log("SOFT DROP");
  });

  socket.on("hard_drop", () => {
    console.log("HARD DROP");
  });
});

function sendState() {
  io.emit("game_state", {
    status: "playing",
    board: drawBoard(),
  });
}

function gameTick() {
  piece.y += 1;

  if (piece.y >= 19) {
    board[piece.y][piece.x] = 1;

    piece.y = 0;
    piece.x = 4;
  }

  sendState();
}

server.listen(3000, () => {
  console.log("Server running on 3000");
});
