
# Space-Game

A classic 2D space shooter game built with HTML5 Canvas and JavaScript. Navigate your spaceship, destroy enemy ships, and try to achieve the highest score!

## Features

*   **Dynamic Background:** Features a looping video background for an immersive experience.
*   **Audio Control:** Background music with a clickable mute/unmute icon.
*   **Player and Enemies:** Control a player spaceship and battle waves of enemy ships.
*   **Scoring System:** Earn points for destroying enemy ships.
*   **Lives System:** Player has a limited number of lives.
*   **Smooth Movement & Controls:**
    *   Arrow keys for player movement (Up, Down, Left, Right).
    *   Spacebar to shoot lasers.
*   **Collision Detection:**
    *   Player collision with enemy ships.
    *   Player lasers hitting enemy ships.
*   **Visual Feedback:**
    *   Player ship changes appearance when moving left/right.
    *   Visual effects for player damage and enemy destruction.
*   **Game States:**
    *   Welcome/Start screen.
    *   Active gameplay.
    *   Game Over (Win/Loss) screen.
    *   Ability to restart the game (Press Enter).
*   **Object-Oriented Design:** Uses classes for Player, Enemy, and Laser objects.
*   **Event-Driven Architecture:** Implements a simple Publish-Subscribe (Pub-Sub) pattern for game events.

## How to Play

1.  **Start the Game:**
    *   Open the `index.html` file (not provided, but assumed to host the `GameCanvas` and `startScreen` elements) in a web browser.
    *   Click on the "Welcome" or "Start" message on the screen to begin.

2.  **Controls:**
    *   **Arrow Up:** Move player ship up.
    *   **Arrow Down:** Move player ship down.
    *   **Arrow Left:** Move player ship left.
    *   **Arrow Right:** Move player ship right.
    *   **Spacebar:** Fire lasers.
    *   **Enter Key (after game over):** Restart the game.
    *   **Click Sound Icon (top-right):** Toggle background music on/off.

3.  **Objective:**
    *   Destroy all enemy ships without losing all your lives.
    *   Avoid colliding with enemy ships.
    *   Achieve the highest score possible.

## Setup and Running the Game

1.  **Prerequisites:**
    *   A modern web browser that supports HTML5 Canvas and JavaScript.

2.  **Files:**
    *   Ensure you have the `script.js` file.
    *   An HTML file (e.g., `index.html`) that includes:
        *   A canvas element: `<canvas id="GameCanvas"></canvas>`
        *   A start screen element: `<div id="startScreen">...</div>` (or similar)
        *   A script tag to load `script.js`: `<script src="script.js"></script>`
    *   The `spaceArt/` directory containing all game assets (images, video, sound) in the same directory as the HTML file or correctly pathed.

3.  **Running:**
    *   Open the `index.html` file in your web browser.

## Project Structure (Assumed)

. ├── index.html // Main HTML file to run the game ├── script.js // Core game logic └── spaceArt/ ├── player.png ├── playerRight.png ├── playerLeft.png ├── playerDamaged.png ├── enemyShip.png ├── life.png ├── laserRed.png ├── laserRedShot.png ├── laserGreenShot.png └── Background/ ├── starry-background.mp4 ├── BackgroundSound.wav ├── muteIcon.png └── volumeIcon.png



## Technologies Used

*   **JavaScript (ES6+):** For game logic, DOM manipulation, and event handling.
*   **HTML5 Canvas API:** For rendering 2D graphics.
*   **HTML5 Audio/Video:** For background music and video.

## Code Overview

*   **`script.js`:** Contains all the game logic.
    *   **Canvas Setup:** Initializes the 2D rendering context.
    *   **Asset Loading:** Asynchronously loads images and sets up background video/audio.
    *   **Game Loop (`gameLoop`):** The main engine that updates game state and re-renders the canvas at regular intervals.
    *   **`DrawGameObject` Class:** A base class for all drawable game entities (Player, Enemy, Laser), handling common properties like position, dimensions, and drawing.
    *   **`Player` Class:** Manages player state (position, lives, score, image), movement, firing logic, and collision response.
    *   **`Enemy` Class:** Manages enemy state, movement (descending), and collision response.
    *   **`Laser` Class:** Manages laser projectile state and movement.
    *   **`EventEmitter` Class:** A simple pub-sub system to manage game events (key presses, collisions, game end).
    *   **Collision Detection (`intersectRect`, `UpdateGameObjects`):** Handles checks for overlaps between game objects.
    *   **Event Handlers:** Listens for keyboard input (movement, shooting, restart) and mouse clicks (sound toggle).
    *   **UI Functions:** Functions to draw the score, lives, messages, and sound icon.
    *   **Game State Management:** Functions to initialize, reset, and end the game.

## Potential Future Enhancements

*   Multiple enemy types with different behaviors.
*   Player power-ups.
*   Boss battles.
*   Levels with increasing difficulty.
*   Persistent high scores (e.g., using `localStorage`).
*   More sophisticated enemy movement patterns.
*   Refactor `setInterval` based movements in `Enemy` and `Laser` classes to be driven by the main game loop for better synchronization and control.

---

