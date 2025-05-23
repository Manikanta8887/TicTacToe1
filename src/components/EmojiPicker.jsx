import React from "react";
import { useDrag } from "react-dnd";
import { EMOJI_CATEGORIES } from "../utils/constants";

const Emoji = ({ emoji }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EMOJI",
    item: { emoji },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <span
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        fontSize: "2rem",
        margin: "0 8px",
        userSelect: "none",
      }}
      role="img"
      aria-label="emoji"
    >
      {emoji}
    </span>
  );
};

const EmojiPicker = ({ category, onSelectEmoji }) => {
  // category is string; list emojis from your EMOJI_CATEGORIES constant
  // or pass emoji list as props

  const emojis = category ? EMOJI_CATEGORIES[category] : [];

  return (
    <div className="flex flex-wrap p-2 border rounded max-w-sm">
      {emojis.map((emoji, idx) => (
        <Emoji key={idx} emoji={emoji} />
      ))}
    </div>
  );
};

export default EmojiPicker;
