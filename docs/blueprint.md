# **App Name**: Single Move Master

## Core Features:

- Puzzle Generation: Procedurally generate new puzzles based on difficulty level, board size, and move mechanics. The puzzles are guaranteed to be solvable in a single move.
- Board Display: Display the game board with interactive tiles or elements. This should include a visually clear display of the current board state and the target pattern to solve the puzzle.
- Move Selection: Enable users to select and apply a single move action (e.g., swap tiles, rotate row/column). Highlight the valid selections available to avoid confusing the user.
- Solution Verification: Determine if the applied move matches the target pattern after the user acts. Provide clear feedback (success/fail) with appropriate animations and transitions.
- Hint System: Allow users to view a hint (i.e., highlight which move should be made) by watching a rewarded ad.
- Statistics Tracking: Track player statistics such as levels completed, time taken, and streaks. Optionally store stats using Firestore or a similar data backend. It's up to a tool whether or not to keep the stats and for how long, using LLM reasoning to make this decision. Use LLM tool to incorporate stats into messages to the user. The data tracked will affect the messages displayed.

## Style Guidelines:

- Primary color: Light, muted yellow (#F7F3E3) evoking focus and concentration on problem-solving.
- Background color: Very pale yellow (#FAF9F0). The background hue matches the primary, but with extremely low saturation for a quiet background.
- Accent color: Muted orange (#E0C284), selected for good visual separation and to bring the interface to life with highlights and animations.
- Font: 'Inter', a grotesque-style sans-serif font suitable for UI, for a clean, modern aesthetic.
- Use clear and intuitive icons to represent different move actions. Icons should be simple and easily recognizable.
- Maintain a clean and organized layout. Clearly show the game board, the target pattern, and the available move options. Keep a minimalist UI that lets users concentrate.
- Use smooth animations and transitions to provide feedback. Highlight tiles upon interactions and to display game state changes.