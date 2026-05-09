import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleEnter = (e) => {
    e.preventDefault();
    if (name.trim() && room.trim()) {
      navigate(`/room/${room}`, { state: { playerName: name } });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleEnter} className="bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Join Game</h2>
        <input
          className="w-full p-3 mb-4 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:border-indigo-500"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-3 mb-6 bg-slate-900 border border-slate-600 rounded text-white outline-none focus:border-indigo-500"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition-colors">
          Enter Room
        </button>
      </form>
    </div>
  );
}