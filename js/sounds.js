const sounds = {
  attack: new Audio("./sounds/Slash.wav"),
  playerDamage: new Audio("./sounds/Hit1.wav"),
  monsterDamage: new Audio("./sounds/Hit2.wav"),
  monsterDefeated: new Audio("./sounds/Explosion.wav"),
  leafCollect: new Audio("./sounds/Grass.wav"),
  ambiance: new Audio("./sounds/Wind.wav"),
  gameOver: new Audio("./sounds/GameOver.wav"),
  gameStart: new Audio("./sounds/Success1.wav"),
  uiClick: new Audio("./sounds/Accept.wav"),
};

sounds.ambiance.loop = true;