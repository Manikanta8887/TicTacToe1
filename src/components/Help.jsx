const Help = () => (
  <div className="mt-6 p-4 bg-white shadow rounded w-80 text-sm">
    <h2 className="font-semibold mb-2">How to Play</h2>
    <ul className="list-disc list-inside space-y-1">
      <li>Each player selects a category of emojis.</li>
      <li>On your turn, a random emoji is given to place on the board.</li>
      <li>You can only have 3 emojis on the board at a time.</li>
      <li>The oldest emoji vanishes if you place a new one.</li>
      <li>First to align 3 emojis wins!</li>
    </ul>
  </div>
);

export default Help;
