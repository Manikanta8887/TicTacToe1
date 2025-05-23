import React from "react";
import { motion } from "framer-motion";

const Cell = ({ value, index, onClick, highlight }) => (
  <motion.button
    className={`w-20 h-20 text-3xl flex items-center justify-center border rounded ${
      highlight ? "bg-yellow-300" : "bg-white"
    }`}
    onClick={onClick}
    whileTap={{ scale: 0.9 }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {value?.emoji}
  </motion.button>
);

export default Cell;
