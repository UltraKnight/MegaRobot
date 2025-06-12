const canvas = document.getElementById('game-stage');
const ctx = canvas.getContext('2d');

let currentGame = new Game();
let currentLevel = parseInt(sessionStorage.getItem('nextLevel')) || 1;
let request;
let terminalVelocity = 1100;
let gravity = 900; // 670
let gravitySpeed = 800;
let levelLastSpeed = 0;
let dyingTimer;
let lastTime = performance.now();
let fpsLastUpdate = lastTime;
let frames = 0;
let FPS = 0;

currentGame.player = new Player();

function loop(timestamp) {
  let deltaTime = timestamp - lastTime;
   if (deltaTime <= 0 || deltaTime > 1000) {
    deltaTime = 0.016; // fallback to 60 FPS
  }
  
  lastTime = timestamp;
  frames++;

  if (timestamp - fpsLastUpdate >= 1000) {
    FPS = Math.floor(1000 / deltaTime);
    fpsLastUpdate = timestamp;
    frames = 0;
  }

  if (dyingTimer === undefined) {
    dyingTimer = timestamp;
  }


  if (controller.pause) {
    // Update lastTime so when unpaused, deltaTime is accurate
    lastTime = timestamp;
    requestAnimationFrame(loop);
    return;
  }

  // lastTime = timestamp;

  level.updateLevel(deltaTime);

  if (controller.k) {
    if (currentGame.player.onGround) {
      if (!(currentGame.player.jumping || currentGame.player.sliding)) {
        currentGame.player.jumping = true;
        currentGame.player.jumpHeight = 360; //350
        jumpSound.play();
      }
    }
  }

  if (controller.s) {
    if (currentGame.player.onGround && currentGame.player.canSlide) {
      if (!(currentGame.player.jumping || currentGame.player.sliding)) {
        if (currentGame.player.lookingRight) {
          currentGame.player.dashSpeed = 304;
        } else {
          currentGame.player.dashSpeed = -304;
        }
        currentGame.player.sliding = true;
        currentGame.player.canSlide = false;
      }
    }
  }

  if (controller.l) {
    if (currentGame.player.canMelee) {
      if (!(currentGame.player.melee || currentGame.player.sliding)) {
        currentGame.player.melee = true;
        currentGame.player.canMelee = false;
        currentGame.player.canMeleeDamage = true;
        saberSound.play();
      }
    }
  }

  if (controller.j) {
    if (!currentGame.player.melee) {
      currentGame.player.shooting = true;
      if (
        controller.left === false &&
        controller.right === false &&
        currentGame.player.jumping === false &&
        currentGame.player.sliding === false
      ) {
        currentGame.player.shoot(deltaTime);
      }
    }
  }

  if (controller.right && controller.left === false) {
    if (!currentGame.player.lookingRight) {
      currentGame.player.turn(deltaTime);
    }
    if (
      !(currentGame.player.jumping || currentGame.player.melee || currentGame.player.sliding) &&
      currentGame.player.onGround
    ) {
      currentGame.player.run(deltaTime);
    }
    if (!currentGame.player.sliding) {
      currentGame.player.xVelocity = 600;
    }
  }

  if (controller.left) {
    if (currentGame.player.lookingRight) {
      currentGame.player.turn(deltaTime);
    }
    if (
      !(currentGame.player.jumping || currentGame.player.melee || currentGame.player.sliding) &&
      currentGame.player.onGround
    ) {
      currentGame.player.run(deltaTime);
    }

    if (!currentGame.player.sliding) {
      currentGame.player.xVelocity = -600;
    }
  }

  // if(currentGame.player.collisionCheck(obstacleTest)) {
  //     currentGame.player.inCollision = true;
  // }

  currentGame.player.move(deltaTime);
  currentGame.showLife();
  currentGame.showFPS(FPS);
  currentGame.player.updateSuperShot(deltaTime);

  if (currentGame.player.jumping) {
    currentGame.player.jump(deltaTime);
  }

  if (currentGame.player.sliding) {
    currentGame.player.dash(deltaTime);
  }

  if (currentGame.player.melee && currentGame.player.jumping === false) {
    currentGame.player.meleeAtk(deltaTime);
  }

  if (currentGame.player.animating === false && currentGame.player.collidingTop === false) {
    currentGame.player.idle(deltaTime);
  }

  level.drawFront();

  if (currentGame.hasEnded) {
    cancelAnimationFrame(request);
    if (!rainSound.sound.paused) {
      rainSound.sound.pause();
    }

    if (currentGame.player.health < 0) {
      request = requestAnimationFrame((deltaTime) => dying(deltaTime));
      return;
    } else {
      currentGame.gameOver();
      return; //avoid entering in gameOver() twice
    }
  }

  //remove dead enemies after 3 seconds every 3 seconds :s
  if (timestamp - dyingTimer >= 4000) {
    //remove the dead enemies after the dying animation is executed

    for (let i = 0; i < level.enemiesToRemove.length; i++) {
      //level.enemies.splice(level.enemiesToRemove[i], 1);
      level.enemiesToRemove.splice(i, 1);
    }

    dyingTimer = timestamp;
  }

  request = requestAnimationFrame(loop);
}

function dying(deltaTime) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  level.updateLevel(deltaTime);
  currentGame.player.die(deltaTime);
  diedSound.play();
  if (currentGame.player.dieAnimation.currentFrame === currentGame.player.dieAnimation.totalFrames) {
    cancelAnimationFrame(request);
    this.animating = false;
    currentGame.gameOver();
    return;
  }
  request = requestAnimationFrame(dying);
}

window.onload = () => {
  let reloading = sessionStorage.getItem('reloading');
  let nextLevel = sessionStorage.getItem('nextLevel');

  let volumeControlEl = document.getElementById('volume-control');
  let volumeEffectsEl = document.getElementById('volume-effects');

  let musicVolumeFromStorage = parseInt(sessionStorage.getItem('musicVolume'));
  let effectsVolumeFromStorage = parseInt(sessionStorage.getItem('effectsVolume'));
  let musicVolume = Number.isInteger(musicVolumeFromStorage) ? musicVolumeFromStorage : volumeControlEl.value;
  let effectsVolume = Number.isInteger(effectsVolumeFromStorage) ? effectsVolumeFromStorage : volumeEffectsEl.value;

  volumeControlEl.value = musicVolume;
  volumeEffectsEl.value = effectsVolume;

  const updateCopyright = () => {
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').innerHTML = currentYear;
  };

  const setInitialVolume = () => {
    backSound.sound.volume = Math.min((musicVolume ?? 0) / 100, 1);
    changeAllEffects(effectsVolume);
  };

  updateCopyright();
  setInitialVolume();

  document.addEventListener('keydown', controller.keyListener);
  document.addEventListener('keyup', controller.keyListener);
  document.getElementById('btn-play').onclick = () => {
    goToLevel(currentLevel);
    currentGame.startGame();
  };
  document.getElementById('btn-play').onmouseover = () => {
    changeImage();
  };
  document.getElementById('btn-play').onmouseout = () => {
    changeImageBack();
  };
  document.getElementById('btn-play-again').onclick = () => {
    currentGame.startGame();
  };
  document.getElementById('btn-finish').onclick = () => {
    currentGame.finishGame();
  };
  volumeControlEl.onchange = (e) => {
    backSound.sound.volume = Math.min(e.target.value / 100, 1);
    sessionStorage.setItem('musicVolume', e.target.value);
  };
  volumeEffectsEl.onchange = (e) => {
    changeAllEffects(e.target.value);
  };

  //activate the start button after page is fully loaded
  let btnPlay = document.getElementById('btn-play');
  btnPlay.innerHTML = 'START GAME';
  btnPlay.disabled = false;

  if (reloading) {
    sessionStorage.removeItem('reloading');
    if (nextLevel) {
      currentLevel = parseInt(nextLevel);
      //sessionStorage.removeItem("nextLevel");
    }

    if (currentLevel > 1) {
      goToLevel(currentLevel);
    }

    currentGame.startGame();
  }
};

function changeImage() {
  document.getElementById('robot').src = './images/cover-hover.png';
}

function changeImageBack() {
  document.getElementById('robot').src = './images/cover.png';
}

const changeAllEffects = (value) => {
  let sounds = [
    jumpSound,
    shootSound,
    superShotSound,
    saberSound,
    boomSound,
    sawSound,
    sawSound2,
    hpPlusSound,
    bossLaugh,
    rainSound,
    dashSound,
    diedSound,
    bossDeathSound,
  ];

  sessionStorage.setItem('effectsVolume', Number(value));
  sounds.forEach((sound) => {
    sound.sound.volume = Math.min((value ?? 0) / 100, 1);
  });
};
