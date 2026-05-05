import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function useGameSocket() {
  const [gameState, setGameState] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("game_state", (state) => {
      setGameState(state);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("game_state");
      socket.off("disconnect");
    };
  }, []);

  const sendInput = (action) => {
    socket.emit(action);
  };

  const joinGame = (room, name) => {
    socket.emit("join_game", { room, name });
  };

  const startGame = () => {
    socket.emit("start_game");
  };

  return {
    gameState,
    connected,
    sendInput,
    joinGame,
    startGame,
  };
}
