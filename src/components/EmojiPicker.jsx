import { EMOJI_CATEGORIES } from "../utils/constants";
import React, { useState } from "react";

const EmojiPicker = ({ startGame }) => {
  const [player1Cat, setPlayer1Cat] = useState("animals");
  const [player2Cat, setPlayer2Cat] = useState("food");

  const handleStart = () => {
    if (player1Cat !== player2Cat) {
      startGame(player1Cat, player2Cat);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label>Player 1 Category:</label>
        <select value={player1Cat} onChange={(e) => setPlayer1Cat(e.target.value)} className="ml-2">
          {Object.keys(EMOJI_CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Player 2 Category:</label>
        <select value={player2Cat} onChange={(e) => setPlayer2Cat(e.target.value)} className="ml-2">
          {Object.keys(EMOJI_CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button onClick={handleStart} className="bg-green-500 text-white px-4 py-2 rounded">
        Start Game
      </button>
    </div>
  );
};

export default EmojiPicker;
