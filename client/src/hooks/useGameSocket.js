import { useEffect, useState, useCallback } from "react";
import { socket } from "../socket";

export default function useGameSocket() {
  const [gameState, setGameState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const [joinError, setJoinError] = useState(null); // <-- Add this state

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
      setSocketId(socket.id);
      setJoinError(null); // Reset error on connect
    });

    socket.on("game_state", (state) => {
      setGameState(state);
      setJoinError(null); // If we get state, join was successful
    });

    // Listen for rejection from the server
    socket.on("room_error", (errorMessage) => {
      setJoinError(errorMessage);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setSocketId(null);
    });

    return () => {
      socket.off("connect");
      socket.off("game_state");
      socket.off("room_error");
      socket.off("disconnect");
    };
  }, []);

  const sendInput = useCallback((action) => {
    socket.emit(action);
  }, []);

  const joinGame = useCallback((room, name) => {
    setJoinError(null); // Clear previous errors
    socket.emit("join_game", { room, name });
  }, []);

  const leaveGame = useCallback((room) => {
    socket.emit("leave_game", room);
    setGameState(null);
  }, []);

  const startGame = useCallback(() => {
    socket.emit("start_game");
  }, []);

  return {
    gameState,
    connected,
    socketId,
    joinError,
    sendInput,
    joinGame,
    startGame,
    leaveGame,
  };
}
