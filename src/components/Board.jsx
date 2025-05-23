import React from "react";
import Cell from "./Cell";

const Board = ({ grid, onCellClick, winningCombo }) => (
  <div className="grid grid-cols-3 gap-2 w-72">
    {grid.map((cell, idx) => (
      <Cell
        key={idx}
        value={cell}
        index={idx}
        onClick={() => onCellClick(idx)}
        highlight={winningCombo?.includes(idx)}
      />
    ))}
  </div>
);

export default Board;
