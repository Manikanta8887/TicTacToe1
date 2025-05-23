const Cell = ({ value, index, onClick, highlight }) => (
  <button
    className={`w-20 h-20 text-3xl flex items-center justify-center border rounded ${
      highlight ? "bg-yellow-300" : "bg-white"
    }`}
    onClick={onClick}
  >
    {value?.emoji}
  </button>
);

export default Cell;
