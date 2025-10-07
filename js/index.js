const openSettingsButton = document.getElementById("open-settings-button");
const closeSettingsButton = document.getElementById("close-settings-button");
const settingsPanel = document.getElementById("settings-panel");
const musicToggleButton = document.getElementById("music-toggle-button");
const soundToggleButton = document.getElementById("sound-toggle-button");
const instructionsPanel = document.getElementById("instructions-panel");
const continueButton = document.getElementById("continue-button");

let isPaused = false;

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;

// RESPONSIVE CANVAS DISPLAY
// - Internal game resolution remains 1024x576 (scaled by DPR for crispness).
// - Only change the CSS display size to fit the window while preserving 16:9.
const INTERNAL_WIDTH = 1024;
const INTERNAL_HEIGHT = 576;

// Internal pixel buffer (crisp on HiDPI)
canvas.width = INTERNAL_WIDTH * dpr;
canvas.height = INTERNAL_HEIGHT * dpr;

// Scale all drawing by DPR so 1 game unit == 1 CSS px at 1024x576 base
c.scale(dpr, dpr);

// Letterbox-fit canvas to viewport while preserving 16:9
function sizeCanvasToViewport() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetAspect = INTERNAL_WIDTH / INTERNAL_HEIGHT;
  const currentAspect = vw / vh;

  let displayW, displayH;
  if (currentAspect > targetAspect) {
    // window is wider than 16:9 -> limit by height
    displayH = vh;
    displayW = Math.round(vh * targetAspect);
  } else {
    // window is taller than 16:9 -> limit by width
    displayW = vw;
    displayH = Math.round(vw / targetAspect);
  }
  canvas.style.width = displayW + "px";
  canvas.style.height = displayH + "px";
}
sizeCanvasToViewport();
window.addEventListener("resize", sizeCanvasToViewport);

// WORLD / CAMERA SIZING

const MAP_COLS = 28;
const MAP_ROWS = 28;
const MAP_WIDTH = 16 * MAP_COLS;
const MAP_HEIGHT = 16 * MAP_ROWS;

// draw scale (world pixels to screen)
const MAP_SCALE = dpr + 2;

const VIEWPORT_WIDTH = canvas.width / MAP_SCALE;
const VIEWPORT_HEIGHT = canvas.height / MAP_SCALE;
const VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2;
const VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2;
const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH;
const MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT;

// LAYERS / TILESETS
const layersData = {
  l_Terrain: l_Terrain,
  l_Trees_1: l_Trees_1,
  l_Trees_2: l_Trees_2,
  l_Trees_3: l_Trees_3,
  l_Trees_4: l_Trees_4,
  l_Landscape_Decorations: l_Landscape_Decorations,
  l_Landscape_Decorations_2: l_Landscape_Decorations_2,
  l_Houses: l_Houses,
  l_House_Decorations: l_House_Decorations,
  l_Characters: l_Characters,
  l_Collisions: l_Collisions,
};
const frontRenderLayersData = {
  l_Front_Renders: l_Front_Renders,
  l_Front_Renders_2: l_Front_Renders_2,
  l_Front_Renders_3: l_Front_Renders_3,
};
const tilesets = {
  l_Terrain: { imageUrl: "./images/terrain.png", tileSize: 16 },
  l_Front_Renders: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Front_Renders_2: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_Front_Renders_3: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees_1: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees_2: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees_3: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Trees_4: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Landscape_Decorations: {
    imageUrl: "./images/decorations.png",
    tileSize: 16,
  },
  l_Landscape_Decorations_2: {
    imageUrl: "./images/decorations.png",
    tileSize: 16,
  },
  l_Houses: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_House_Decorations: { imageUrl: "./images/decorations.png", tileSize: 16 },
  l_Characters: { imageUrl: "./images/characters.png", tileSize: 16 },
  l_Collisions: { imageUrl: "./images/characters.png", tileSize: 16 },
};

// Tile setup
const collisionBlocks = [];
const blockSize = 16;
collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        })
      );
    }
  });
});

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize);
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const tileIndex = symbol - 1;
        const srcX = (tileIndex % tilesPerRow) * tileSize;
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize;
        context.drawImage(
          tilesetImage,
          srcX,
          srcY,
          tileSize,
          tileSize,
          x * 16,
          y * 16,
          16,
          16
        );
      }
    });
  });
};

const renderStaticLayers = async (layersData) => {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenContext = offscreenCanvas.getContext("2d");

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName];
    if (tilesetInfo) {
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl);
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext
        );
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error);
      }
    }
  }
  return offscreenCanvas;
};

// Player/monsters
const player = new Player({ x: 161, y: 128, size: 15 });

const monsterSprites = {
  walkDown: { x: 0, y: 0, width: 16, height: 16, frameCount: 4 },
  walkUp: { x: 16, y: 0, width: 16, height: 16, frameCount: 4 },
  walkLeft: { x: 32, y: 0, width: 16, height: 16, frameCount: 4 },
  walkRight: { x: 48, y: 0, width: 16, height: 16, frameCount: 4 },
};
const monsters = [
  new Monster({
    x: 210,
    y: 155,
    size: 15,
    imageSrc: "./images/flam.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 300,
    y: 150,
    size: 15,
    imageSrc: "./images/cyclope.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 48,
    y: 400,
    size: 15,
    imageSrc: "./images/axolot.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 112,
    y: 416,
    size: 15,
    imageSrc: "./images/snake.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 288,
    y: 416,
    size: 15,
    imageSrc: "./images/owl.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 400,
    y: 400,
    size: 15,
    imageSrc: "./images/yellowbat.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 288,
    y: 256,
    size: 15,
    imageSrc: "./images/spider.png",
    sprites: monsterSprites,
  }),
  new Monster({
    x: 144,
    y: 336,
    size: 15,
    imageSrc: "./images/butterfly.png",
    sprites: monsterSprites,
  }),
];

// Input
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

let lastTime = performance.now();
let frontRendersCanvas;
const hearts = [
  new Heart({ x: 10, y: 10 }),
  new Heart({ x: 32, y: 10 }),
  new Heart({ x: 54, y: 10 }),
];
const leaves = [new Leaf({ x: 20, y: 20, velocity: { x: 0.08, y: 0.08 } })];

let elapsedTime = 0;
function animate(backgroundCanvas) {
  if (isPaused) {
    requestAnimationFrame(() => animate(backgroundCanvas));
    return;
  }

  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  elapsedTime += deltaTime;
  if (elapsedTime > 1.5) {
    leaves.push(
      new Leaf({
        x: Math.random() * 150,
        y: Math.random() * 50,
        velocity: { x: 0.08, y: 0.08 },
      })
    );
    elapsedTime = 0;
  }

  player.handleInput(keys);
  player.update(deltaTime, collisionBlocks);

  const horizontalScrollDistance = Math.min(
    Math.max(0, player.center.x - VIEWPORT_CENTER_X),
    MAX_SCROLL_X
  );
  const verticalScrollDistance = Math.min(
    Math.max(0, player.center.y - VIEWPORT_CENTER_Y),
    MAX_SCROLL_Y
  );

  c.clearRect(0, 0, canvas.width, canvas.height);
  c.save();
  c.scale(MAP_SCALE, MAP_SCALE);
  c.translate(-horizontalScrollDistance, -verticalScrollDistance);
  c.drawImage(backgroundCanvas, 0, 0);

  // Monsters + collisions
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i];
    monster.update(deltaTime, collisionBlocks);

    // Attack collisions
    if (
      player.attackBox.x + player.attackBox.width >= monster.x &&
      player.attackBox.x <= monster.x + monster.width &&
      player.attackBox.y + player.attackBox.height >= monster.y &&
      player.attackBox.y <= monster.y + monster.height &&
      player.isAttacking &&
      !player.hasHitEnemy
    ) {
      monster.receiveHit();
      player.hasHitEnemy = true;
      if (monster.health <= 0) {
        sounds.monsterDefeated.play();
        monsters.splice(i, 1);
      }
    }

    // Monster hits player
    if (
      player.x + player.width >= monster.x &&
      player.x <= monster.x + monster.width &&
      player.y + player.height >= monster.y &&
      player.y <= monster.y + monster.height &&
      !player.isInvincible
    ) {
      player.receiveHit();
      const filledHearts = hearts.filter((heart) => heart.currentFrame === 4);
      if (filledHearts.length > 0)
        filledHearts[filledHearts.length - 1].currentFrame = 0;

      if (filledHearts.length <= 1) {
        openSettingsButton.style.display = "none";
        const gameOverScreen = document.getElementById("game-over-screen");
        gameOverScreen.style.display = "flex";
        const restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click", () => {
          sounds.uiClick.play();
          window.location.reload();
        });
        sounds.gameOver.play();
        return;
      }
    }
  }

  // Depth sort drawables
  const renderables = [player, ...monsters];
  renderables.sort((a, b) => a.y - b.y);
  renderables.forEach((r) => r.draw(c));

  // Success
  if (monsters.length === 0) {
    openSettingsButton.style.display = "none";
    const successScreen = document.getElementById("success-screen");
    successScreen.style.display = "flex";
    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.addEventListener("click", () => {
      sounds.uiClick.play();
      window.location.reload();
    });
    return;
  }

  c.drawImage(frontRendersCanvas, 0, 0);

  // Leaves FX
  for (let i = leaves.length - 1; i >= 0; i--) {
    const leaf = leaves[i];
    leaf.update(deltaTime);
    leaf.draw(c);
    if (leaf.alpha <= 0) leaves.splice(i, 1);

    // Collect leaf
    if (
      player.x < leaf.x + leaf.width &&
      player.x + player.width > leaf.x &&
      player.y < leaf.y + leaf.height &&
      player.y + player.height > leaf.y
    ) {
      sounds.leafCollect.play();
      leaves.splice(i, 1);
    }
  }

  c.restore();

  // HUD
  c.save();
  c.scale(MAP_SCALE, MAP_SCALE);
  hearts.forEach((heart) => heart.draw(c));
  c.restore();

  requestAnimationFrame(() => animate(backgroundCanvas));
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers(layersData);
    frontRendersCanvas = await renderStaticLayers(frontRenderLayersData);
    if (!backgroundCanvas) {
      console.error("Failed to create the background canvas");
      return;
    }
    animate(backgroundCanvas);
  } catch (error) {
    console.error("Error during rendering:", error);
  }
};

// UI events
const startButton = document.getElementById("start-button");
const splashScreen = document.getElementById("splash-screen");

startButton.addEventListener("click", () => {
  sounds.uiClick.play();
  splashScreen.style.display = "none";
  instructionsPanel.style.display = "flex";
});

continueButton.addEventListener("click", () => {
  sounds.uiClick.play();
  instructionsPanel.style.display = "none";
  openSettingsButton.style.display = "block";
  sounds.gameStart.play();
  sounds.ambiance.play();
  startRendering();
});

openSettingsButton.addEventListener("click", () => {
  sounds.uiClick.play();
  isPaused = true;
  settingsPanel.style.display = "flex";
});

closeSettingsButton.addEventListener("click", () => {
  sounds.uiClick.play();
  isPaused = false;
  settingsPanel.style.display = "none";
  lastTime = performance.now();
});

musicToggleButton.addEventListener("click", () => {
  sounds.uiClick.play();
  sounds.ambiance.muted = !sounds.ambiance.muted;
  musicToggleButton.textContent = sounds.ambiance.muted
    ? "Music: OFF 🔇"
    : "Music: ON 🔊";
});

soundToggleButton.addEventListener("click", () => {
  sounds.uiClick.play();
  const isMuted = Object.values(sounds)
    .filter((s) => s !== sounds.uiClick && s !== sounds.ambiance)
    .some((s) => !s.muted);
  for (const s of Object.values(sounds)) {
    if (s !== sounds.uiClick && s !== sounds.ambiance) s.muted = isMuted;
  }
  soundToggleButton.textContent = isMuted ? "Sounds: OFF 🔇" : "Sounds: ON 🔊";
});