function createBoard() {
  return Array.from({ length: 20 }, () => Array(10).fill(0));
}

function randomPiece() {
  const pieces = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
  ];
  return pieces[Math.floor(Math.random() * pieces.length)];
}

function collide(board, piece) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (
        piece.shape[y][x] !== 0 &&
        (board[y + piece.y]?.[x + piece.x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge(board, piece) {
  piece.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val !== 0) {
        board[y + piece.y][x + piece.x] = val;
      }
    });
  });
}

module.exports = {
  createBoard,
  randomPiece,
  collide,
  merge,
};
