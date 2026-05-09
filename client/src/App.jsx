import { useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useGameSocket from "./hooks/useGameSocket";
import GameBoard from "./components/GameBoard";
import Lobby from "./components/Lobby";
import Room from "./components/Room";

export default function App() {
  const {
    gameState,
    connected,
    socketId,
    sendInput,
    joinGame,
    startGame,
    leaveGame,
  } = useGameSocket();

  useEffect(() => {
    const handleKey = (e) => {
      if (!gameState?.running) return;
      if (e.key === "ArrowLeft") sendInput("move_left");
      if (e.key === "ArrowRight") sendInput("move_right");
      if (e.key === "ArrowUp") sendInput("rotate");
      if (e.key === "ArrowDown") sendInput("soft_drop");
      if (e.key === " ") sendInput("hard_drop");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sendInput, gameState?.running]);

  const player = gameState?.players?.find((p) => p.id === socketId);
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

  if (!connected)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        Connecting to server...
      </div>
    );

  // If the game is running, show the board regardless of URL
  if (gameState?.running) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <h1 className="text-center text-4xl font-black mb-8 text-indigo-500">
          RED TETRIS
        </h1>
        <GameBoard board={board} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route
          path="/room/:id"
          element={
            <Room
              joinGame={joinGame}
              startGame={startGame}
              gameState={gameState}
              socketId={socketId}
              leaveGame={leaveGame}
            />
          }
        />
        {/* Redirect any unknown route to Lobby */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
