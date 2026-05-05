export default function GameBoard({ board }) {
  if (!board) return <div>Loading...</div>;

  return (
    <div className="board">
      {board.map((row, y) => (
        <div key={y} className="row">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`cell ${cell ? "filled" : ""}`}
            />
            
          ))}
        </div>
      ))}
    </div>
  );
}