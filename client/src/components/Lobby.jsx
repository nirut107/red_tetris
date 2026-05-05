import { useState } from "react";

export default function Lobby({ joinGame, startGame }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("room1");

  return (
    <div>
      <h2>Lobby</h2>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />

      <button onClick={() => joinGame(room, name)}>
        Join Game
      </button>

      <button onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}