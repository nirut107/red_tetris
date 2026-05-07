import { useState } from "react";

export default function Lobby({ joinGame, startGame, joined, isHost, players }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("room1");

  return (
    <div>
      <h2>Lobby</h2>

      {!joined && (
        <>
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
        </>
      )}

      {joined && (
        <>
          <h3>Players</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.name || "Player"}</li>
            ))}
          </ul>

          {isHost ? (
            <button onClick={startGame}>
              Start Game
            </button>
          ) : (
            <p>Waiting for host to start...</p>
          )}
        </>
      )}
    </div>
  );
}
