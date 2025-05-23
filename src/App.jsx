import React, { useState, useEffect, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmojiPicker from "./components/EmojiPicker";

// Drag item type
const ItemTypes = {
  EMOJI: "emoji",
};

// Winning combos for 3x3 grid
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

// Helper: check if player won
const checkWin = (grid, player) => {
  return WINNING_COMBOS.some((combo) =>
    combo.every((index) => grid[index]?.player === player)
  );
};

// Draggable emoji cell on board
const DraggableCell = ({ index, emojiData, onDrop, currentTurn, winner }) => {
  // Drag source
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EMOJI,
    item: { ...emojiData, index, fromPalette: false },
    canDrag: !winner && emojiData?.player === currentTurn,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [emojiData, currentTurn, winner]);

  // Drop target
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.EMOJI,
    drop: (item) => onDrop(item, index),
    canDrop: (item) => !emojiData, // only allow drop if cell empty
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [emojiData, onDrop]);

  // Combine drag and drop refs using React ref callback
  const ref = React.useCallback((node) => {
    drag(node);
    drop(node);
  }, [drag, drop]);

  return (
    <div
      ref={ref}
      className={`w-20 h-20 flex justify-center items-center text-5xl select-none rounded border-2
      ${
        isOver && canDrop
          ? "bg-green-400"
          : "bg-gradient-to-tr from-purple-900 via-pink-900 to-purple-900"
      }
      ${emojiData ? "cursor-grab" : "cursor-pointer"}
      `}
      style={{ userSelect: "none", transition: "background-color 0.3s ease" }}
      aria-label={`Cell ${index + 1} ${emojiData ? "occupied" : "empty"}`}
    >
      <span style={{ opacity: isDragging ? 0.4 : 1 }}>{emojiData?.emoji}</span>
    </div>
  );
};

export default function App() {
  // Grid: array of 9 cells, each null or {emoji, player}
  const [grid, setGrid] = useState(Array(9).fill(null));

  // Moves: track indices of emojis placed per player {1: [indices], 2: [indices]}
  const [moves, setMoves] = useState({ 1: [], 2: [] });

  // Turn: 1 or 2
  const [turn, setTurn] = useState(1);

  // Winner: null or player number
  const [winner, setWinner] = useState(null);

  // Scores from localStorage
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  // Players emoji categories (matching your existing constants)
  const players = { 1: "animals", 2: "fruits" };

  // Load scores from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("blinkScores");
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  // Save scores on update
  useEffect(() => {
    localStorage.setItem("blinkScores", JSON.stringify(scores));
  }, [scores]);

  // Check if the last player to move won
  const checkGameEnd = useCallback(
    (gridState, lastPlayer) => {
      if (checkWin(gridState, lastPlayer)) {
        setWinner(lastPlayer);
        setScores((prev) => ({ ...prev, [lastPlayer]: prev[lastPlayer] + 1 }));
      }
    },
    [setScores]
  );

  // Handle drop (drag from palette or move on board)
  const handleDrop = useCallback(
    (item, toIndex) => {
      if (winner) return; // no moves if game ended
      if (grid[toIndex]) return; // can't drop on occupied cell

      if (item.fromPalette) {
        // New emoji from palette

        if (item.player !== turn) return; // only current player can place

        // Check if player already has 3 emojis placed
        if (moves[turn].length === 3) {
          // Remove oldest emoji before placing new one
          const oldestIndex = moves[turn][0];
          let newGrid = [...grid];
          let newMoves = { ...moves };

          newGrid[oldestIndex] = null;
          newMoves[turn] = newMoves[turn].slice(1);

          // Place new emoji
          newGrid[toIndex] = { emoji: item.emoji, player: turn };
          newMoves[turn] = [...newMoves[turn], toIndex];

          setGrid(newGrid);
          setMoves(newMoves);

          setTurn(turn === 1 ? 2 : 1);
          checkGameEnd(newGrid, turn);
          return;
        }

        // Place directly if fewer than 3 emojis on board
        let newGrid = [...grid];
        let newMoves = { ...moves };

        newGrid[toIndex] = { emoji: item.emoji, player: turn };
        newMoves[turn] = [...newMoves[turn], toIndex];

        setGrid(newGrid);
        setMoves(newMoves);

        setTurn(turn === 1 ? 2 : 1);
        checkGameEnd(newGrid, turn);
      } else {
        // Move emoji already on board

        if (item.player !== turn) return; // only current player can move own emoji

        const fromIndex = item.index;

        if (!grid[fromIndex] || grid[fromIndex].player !== turn) return;

        let newGrid = [...grid];
        let newMoves = { ...moves };

        newGrid[toIndex] = newGrid[fromIndex];
        newGrid[fromIndex] = null;

        const playerMoves = newMoves[turn].filter((i) => i !== fromIndex);
        playerMoves.push(toIndex);
        newMoves[turn] = playerMoves;

        setGrid(newGrid);
        setMoves(newMoves);

        setTurn(turn === 1 ? 2 : 1);
        checkGameEnd(newGrid, turn);
      }
    },
    [grid, moves, turn, winner, checkGameEnd]
  );

  // Reset game
  const resetGame = () => {
    setGrid(Array(9).fill(null));
    setMoves({ 1: [], 2: [] });
    setTurn(1);
    setWinner(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen bg-gradient-to-r from-purple-700 via-pink-900 to-purple-700
        flex flex-col items-center justify-center p-6 space-y-8 text-white font-bold"
      >
        <h1 className="text-4xl mb-2 drop-shadow-lg">Blink Tac Toe</h1>

        <div className="flex items-center space-x-16">
          <div className="text-center">
            <div className="mb-1 text-xl">Player 1 (Animals)</div>
            <div>Score: {scores[1]}</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-xl">Player 2 (Fruits)</div>
            <div>Score: {scores[2]}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-black bg-opacity-30 p-4 rounded-lg shadow-lg">
          {grid.map((cell, idx) => (
            <DraggableCell
              key={idx}
              index={idx}
              emojiData={cell}
              onDrop={handleDrop}
              currentTurn={turn}
              winner={winner}
            />
          ))}
        </div>

        <div className="text-lg">
          {winner ? (
            <div className="text-green-400">Player {winner} wins! 🎉</div>
          ) : (
            <div>Player {turn}&apos;s turn — drag an emoji to place or move</div>
          )}
        </div>

        {/* Emoji Picker: show current player's emoji palette */}
        <div className="mt-4">
          <EmojiPicker category={players[turn]} player={turn} />
        </div>

        <button
          onClick={resetGame}
          className="mt-6 px-5 py-2 bg-pink-600 rounded shadow hover:bg-pink-700 transition"
          aria-label="Reset game"
        >
          Reset Game
        </button>
      </div>
    </DndProvider>
  );
}
