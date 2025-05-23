import React from "react";
import { useDrop } from "react-dnd";
import Cell from "./Cell";

const Board = ({ grid, onDropEmoji }) => {
  return (
    <div
      className="grid grid-cols-3 gap-2"
      style={{ width: "max-content", margin: "auto" }}
    >
      {grid.map((cell, index) => (
        <CellDropTarget
          key={index}
          index={index}
          value={cell}
          onDropEmoji={onDropEmoji}
        />
      ))}
    </div>
  );
};

const CellDropTarget = ({ index, value, onDropEmoji }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "EMOJI",
    drop: (item) => onDropEmoji(index, item.emoji),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-20 h-20 border rounded flex items-center justify-center cursor-pointer
      ${isOver && canDrop ? "bg-green-200" : "bg-white"}`}
    >
      <Cell value={value} />
    </div>
  );
};

export default Board;
