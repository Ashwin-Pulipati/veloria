<div align="center">
  <a href="https://github.com/Ashwin-Pulipati/veloria">
    <img src="images/logo.png" alt="Logo" width="80" height="100">
  </a>

  <h3 align="center">Veloria</h3>

  <p align="center">
    A 2D adventure game built with HTML5 Canvas and JavaScript.
    <br />
    <a href="https://ashwin-pulipati.github.io/veloria/"><strong>View Demo »</strong></a>
  </p>
</div>

## 📝 About The Project

Veloria is a classic 2D adventure game where players navigate a vibrant world, battling monsters and exploring different levels. The game is built entirely with vanilla JavaScript and rendered on an HTML5 Canvas, showcasing browser-based game development techniques.


https://github.com/user-attachments/assets/a8b1a7aa-ddf6-4a1b-b4e3-0e502831b739


## ⚙️ Built With

This project is built with fundamental web technologies, demonstrating a pure JavaScript-based game engine.

*   **Frontend:** HTML5 & CSS3
*   **Game Logic:** Vanilla JavaScript
*   **Rendering:** HTML5 Canvas

## 🛠️ Tools Used

*   **MapperMate:** A free online tilemap editor used for creating the game maps.

## ✅ Key Features

- **Responsive Design:** The game is fully responsive and adapts to different screen sizes, providing a seamless experience on both desktop and mobile devices.
- **Onboarding:** An instruction pop-up appears at the beginning of the game to help new players get started.
- **Dynamic Player Movement:** Smooth, key-based character navigation.
- **Collision Detection:** Accurate collision handling with environmental objects.
- **Combat System:** Engage in battles with various monsters.
- **Health & Items:** Collect hearts to replenish health and leaves for potential power-ups.
- **Layered World:** Rich, multi-layered maps creating a sense of depth.
- **Sound Effects:** Immersive audio feedback for actions and events.
- **Character Identification:** Clear identification of the player and enemy characters in the game's instructions and settings.

## 🏗️ System Architecture

Veloria is built on a custom 2D Canvas Engine designed for efficiency and smooth interaction. The architecture follows a classic Update-Render Game Loop pattern, ensuring decoupled logic for physics, AI, and graphics.

### 1. The Core Loop (Engine Heartbeat)
*   **Delta-Time Scaling:** The engine uses requestAnimationFrame with delta-time calculations to ensure game speed remains consistent regardless of the user's monitor refresh rate (60Hz, 144Hz, etc.).
*   **State Management:** Orchestrates transitions between loading screens, active gameplay, and combat resolution.

### 2. Entity Component Logic (OOP)
*   **Modular Entity Classes:** Utilizes a robust Class-based structure for Player and Monster. By encapsulating state (velocity, health, invincibility frames), the engine can manage dozens of active entities with minimal overhead.
*   **Action State Machine:** Manages complex animation states (Idle, Run, Attack, Hit) based on user input and environmental triggers.

### 3. Physics & Collision System
*   **AABB Collision Detection:** Implements Axis-Aligned Bounding Box (AABB) logic for precise interaction between entities and the environment.
*   **World Parsing:** The engine parses Tiled-based map data into CollisionBlock objects, allowing for complex level designs without manual coordinate mapping.
*   **Spatial Hit Detection:** Combat uses a specialized hit-box detection system to resolve interactions between the Player’s sword swing and Monster hurt-boxes.

### 4. Rendering Pipeline
*   **Y-Sorting (Depth Management):** To simulate a 2.5D top-down perspective, the engine dynamically sorts entities based on their Y coordinates, ensuring players appear "behind" or "in front of" objects correctly.
*   **Layered Rendering:** Separates the environment into Background, Entity, and Foreground layers to allow for immersive elements like walking behind trees or under arches.
*   **HUD & UI Overlay:** A dedicated UI layer tracks player vitals (Heart system) in real-time without interfering with the game world's coordinate system.

## ▶️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You only need a modern web browser that supports HTML5 and JavaScript.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Ashwin-Pulipati/veloria.git
    cd veloria
    ```
2.  **Run the game:**
    Simply open the `index.html` file in your web browser.
    ```sh
    # On Windows
    start index.html
    
    # On macOS
    open index.html
    
    # On Linux
    xdg-open index.html
    ```

## 🚀 Usage

When you first load the game, you will be greeted with a splash screen. Clicking the "Start Game" button will open an instruction pop-up with details on the game's objective, characters, and controls. Click "Continue" to start the game.

Use the **W** (Up), **A** (Left), **S** (Down), and **D** (Right) keys or the **Arrow Keys** to move your character around the map and the **Space Key** to attack enemies. The main objective is to defeat all the monsters that have invaded the village.

You can access the **Settings & Info** panel by clicking the **⚙️** button on the top right of the screen. This panel provides information on the game's objective, characters, controls, and includes options to toggle the music and sound effects.



## 🏆 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/nishanthpilli/">
        <img src="https://tinyurl.com/nishanth-profile" width="100px;" alt="Nishanth Pilli"/><br />
      </a>
      <span><b>Nishanth Pilli</b></span><br />
      <span>(Product Designer)</span><br />
      <a href="https://www.linkedin.com/in/nishanthpilli/">LinkedIn</a> | 
      <a href="https://www.nishanthpilli.com/">Portfolio</a>
    </td>
  </tr>
</table>

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

You can also report a bug or request a feature by opening an issue:
- [Report Bug](https://github.com/Ashwin-Pulipati/veloria/issues)
- [Request Feature](https://github.com/Ashwin-Pulipati/veloria/issues)


## 📄 License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 📧 Contact

Ashwin Pulipati - [LinkedIn](https.linkedin.com/in/ashwinpulipati/) - ashwinpulipati@gmail.com

Project Link: [https://github.com/Ashwin-Pulipati/veloria](https://github.com/Ashwin-Pulipati/veloria)
