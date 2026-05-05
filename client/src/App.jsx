import { useEffect } from "react";
import useGameSocket from "./hooks/useGameSocket";
import GameBoard from "./components/GameBoard";
import Lobby from "./components/Lobby";

export default function App() {
  const {
    gameState,
    connected,
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

  if (!connected) return <div>Connecting...</div>;

  if (!gameState || gameState.status === "waiting") {
    return <Lobby joinGame={joinGame} startGame={startGame} />;
  }
  console.log(gameState)

  return (
    <div>
      <h1>Red Tetris</h1>
      <GameBoard board={gameState.board} />
    </div>
  );
}