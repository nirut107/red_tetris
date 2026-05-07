import { useEffect, useMemo } from "react";
import useGameSocket from "./hooks/useGameSocket";
import GameBoard from "./components/GameBoard";
import Lobby from "./components/Lobby";

export default function App() {
  const {
    gameState,
    connected,
    socketId,
    sendInput,
    joinGame,
    startGame,
  } = useGameSocket();

  // 🎮 keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") sendInput("move_left");
      if (e.key === "ArrowRight") sendInput("move_right");
      if (e.key === "ArrowUp") sendInput("rotate");
      if (e.key === "ArrowDown") sendInput("soft_drop");
      if (e.key === " ") sendInput("hard_drop");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sendInput]);

  const player = gameState?.players?.find((p) => p.id === socketId);
  const isHost = gameState?.host === socketId;
  const board = useMemo(() => {
    if (!player?.board) return null;

    const nextBoard = player.board.map((row) => [...row]);
    const piece = player.piece;

    if (!piece) return nextBoard;

    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && nextBoard[piece.y + y]?.[piece.x + x] !== undefined) {
          nextBoard[piece.y + y][piece.x + x] = cell;
        }
      });
    });

    return nextBoard;
  }, [player]);

  if (!connected) return <div>Connecting...</div>;

  if (!gameState || !gameState.running) {
    return (
      <Lobby
        joinGame={joinGame}
        startGame={startGame}
        joined={Boolean(player)}
        isHost={isHost}
        players={gameState?.players ?? []}
      />
    );
  }

  return (
    <div>
      <h1>Red Tetris</h1>
      <GameBoard board={board} />
    </div>
  );
}
