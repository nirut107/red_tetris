import { useEffect, useRef } from "react"; // <-- Import useRef
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function Room({
  joinGame,
  startGame,
  gameState,
  socketId,
  joinError,
  leaveGame
}) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const playerName = location.state?.playerName;

  const joinAttempted = useRef(false);

  useEffect(() => {
    if (joinError) {
      alert(`Could not join room: ${joinError}`);
      navigate("/");
    }
  }, [joinError, navigate]);

  useEffect(() => {
    if (!socketId || joinAttempted.current) return;

    const isAlreadyInRoom = gameState?.players?.some((p) => p.id === socketId);
    if (isAlreadyInRoom) return;

    if (!playerName) {
      const promptName = prompt(`Enter your name to join room [${id}]:`);
      if (promptName) {
        joinAttempted.current = true;
        joinGame(id, promptName);
      } else {
        navigate("/");
      }
    } else {
      joinAttempted.current = true;
      joinGame(id, playerName);
    }
  }, [id, socketId, playerName, navigate, gameState, joinGame]);

  const isHost = gameState?.host === socketId;
  const players = gameState?.players || [];

  const handleLeaveRoom = () => {
    leaveGame(id);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end border-b border-slate-700 pb-4 mb-8">
          <div>
            <h1 className="text-sm text-slate-500 uppercase tracking-widest">
              Room
            </h1>
            <p className="text-3xl font-mono font-bold text-indigo-400">{id}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-slate-500 text-sm">Status</p>
              <p className="text-green-400 font-medium">
                Waiting for players...
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-sm">Status</p>
            <p className="text-green-400 font-medium">Waiting for players...</p>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 bg-slate-800 hover:bg-red-900/50 text-red-400 hover:text-red-300 border border-slate-700 hover:border-red-800 rounded transition-colors text-sm font-bold"
          >
            Leave Room
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Players</h3>
            <ul className="space-y-3">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
                >
                  <span>
                    {p.name}{" "}
                    {p.id === socketId && (
                      <span className="text-xs text-indigo-400">(You)</span>
                    )}
                  </span>
                  {gameState.host === p.id && (
                    <span className="text-xs bg-yellow-600 px-2 py-1 rounded text-white">
                      HOST
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            {isHost ? (
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-105"
              >
                START GAME
              </button>
            ) : (
              <div className="text-center p-6 bg-slate-800 rounded-xl border border-dashed border-slate-600">
                <p className="text-slate-400">Waiting for host to start...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
