import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function useGameSocket() {
  const [gameState, setGameState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id);
    });

    socket.on("game_state", (state) => {
      setGameState(state);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId(null);
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
    socketId,
    sendInput,
    joinGame,
    startGame,
  };
}
