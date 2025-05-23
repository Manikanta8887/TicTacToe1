import React, { useState } from "react";
import Board from "./components/Board";
import EmojiPicker from "./components/EmojiPicker";
import Help from "./components/Help";
import { EMOJI_CATEGORIES, INITIAL_GRID } from "./utils/constants";
import { checkWinner } from "./utils/helpers";
import './index.css'
import './App.css'

const App = () => {
  const [players, setPlayers] = useState({ 1: null, 2: null });
  const [turn, setTurn] = useState(1);
  const [grid, setGrid] = useState(INITIAL_GRID);
  const [moves, setMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = (cat1, cat2) => {
    setPlayers({ 1: cat1, 2: cat2 });
    setGameStarted(true);
  };

  const playMove = (index) => {
    if (grid[index] || winner) return;

    const player = turn;
    const category = players[player];
    const emoji = randomEmoji(category);

    const newGrid = [...grid];
    const newMoves = { ...moves };

    if (newMoves[player].length === 3) {
      const [oldIdx] = newMoves[player];
      if (oldIdx === index) return;
      newGrid[oldIdx] = null;
      newMoves[player].shift();
    }

    newGrid[index] = { emoji, player };
    newMoves[player].push(index);

    const win = checkWinner(newGrid, newMoves);
    setGrid(newGrid);
    setMoves(newMoves);

    if (win) {
      setWinner(player);
    } else {
      setTurn(player === 1 ? 2 : 1);
    }
  };

  const randomEmoji = (category) => {
    const emojis = EMOJI_CATEGORIES[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const resetGame = () => {
    setGrid(INITIAL_GRID);
    setMoves({ 1: [], 2: [] });
    setTurn(1);
    setWinner(null);
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🧠 Blink Tac Toe</h1>

      {!gameStarted ? (
        <EmojiPicker startGame={startGame} />
      ) : (
        <>
          <div className="mb-4">
            {winner ? (
              <div className="text-green-600 text-xl font-semibold">
                Player {winner} Wins!
                <button onClick={resetGame} className="ml-4 bg-blue-500 text-white px-3 py-1 rounded">
                  Play Again
                </button>
              </div>
            ) : (
              <div>Player {turn}'s Turn</div>
            )}
          </div>

          <Board grid={grid} onCellClick={playMove} winningCombo={winner && checkWinner(grid)} />

          <Help />
        </>
      )}
    </div>
  );
};

export default App;
