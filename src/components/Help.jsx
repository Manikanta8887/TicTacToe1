import React from "react";

const Help = () => (
  <div className="mt-6 p-4 bg-white shadow rounded w-80 max-w-full text-sm">
    <h2 className="font-semibold mb-2 text-lg">How to Play</h2>
    <ul className="list-disc list-inside space-y-1">
      <li>Each player selects a category of emojis.</li>
      <li>On your turn, a random emoji from your category is assigned to place on the board.</li>
      <li>You can only have 3 emojis on the board at any time.</li>
      <li>If placing a 4th emoji, your oldest emoji disappears (vanishing rule).</li>
      <li>First player to align 3 emojis in a row wins.</li>
    </ul>
  </div>
);

export default Help;
