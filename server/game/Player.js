const { createBoard, collide, merge } = require("./utils");

class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.board = createBoard();
    this.piece = null;
  }

  spawnPiece(nextPiece) {
    this.piece = nextPiece();
    this.piece.x = 4;
    this.piece.y = 0;
  }

  update(nextPiece) {
    if (!this.piece) {
      this.spawnPiece(nextPiece);
      return;
    }

    this.piece.y++;

    if (collide(this.board, this.piece)) {
      this.piece.y--;
      merge(this.board, this.piece);
      this.spawnPiece(nextPiece);
    }
  }

  handleInput(action) {
    if (!this.piece) return;

    switch (action) {
      case "left":
        this.move(-1, 0);
        break;
      case "right":
        this.move(1, 0);
        break;
      case "down":
        this.move(0, 1);
        break;
      case "rotate":
        // TODO rotation
        break;
      case "hard_drop":
        while (!collide(this.board, this.piece)) {
          this.piece.y++;
        }
        this.piece.y--;
        break;
    }
  }

  move(dx, dy) {
    this.piece.x += dx;
    this.piece.y += dy;

    if (collide(this.board, this.piece)) {
      this.piece.x -= dx;
      this.piece.y -= dy;
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      board: this.board,
      piece: this.piece,
    };
  }
}

module.exports = Player;
