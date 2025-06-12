const level = {
  layers: ['./images/levels/level-1/level-1.png', './images/levels/level-1/level-1-front.png'],
  x: 0,
  speed: 0,
  speedAcumulator: 0, //used to make other resources scroll with the level
  spawnCooldown: 5000, // 5s
  bossSpawned: false,
  raining: false,
  enemies: [],
  bombs: [],
  maxRobots: 20,
  remainingRobots: 20, //remaining to be spawned
  enemiesToRemove: [], //receives enemy that must be removed from the array after death animation completes
  traps: [],
  collectors: [],
  collPos: [
    [3410, 500, 'hp', 247, 224, 2],
    [4100, 500, 'super-shot', 247, 304, 2],
    [6000, 600, 'rapid-s', 300, 300, 6],
    [7000, 700, 'blue-shot', 300, 300, 6],
  ], //x, y, animation width, animation height
  collectorsSrc: [
    `./images/collectors/hp/hp-plus.png`,
    `./images/collectors/super-shot/super-bonus.png`,
    `./images/collectors/rapid-s/rapid-s.png`,
    `./images/collectors/blue-shot/blue-shot.png`,
  ],
  trapsPos: [
    [1200, 610],
    [3335, 545],
    [6000, 630],
    [6500, 630],
  ],
  trapsSrc: [
    `./images/levels/traps/saw/saw.png`,
    `./images/levels/traps/saw/saw.png`,
    `./images/levels/traps/saw/saw.png`,
    `./images/levels/traps/saw/saw.png`,
  ],
  platforms: [],
  platformsPos: [
    [521, 460],
    [720, 490],
    [1220, 570],
    [3270, 550],
    [4000, 560],
  ],
  platformsSrc: [
    './images/platforms/tile_middle.png',
    './images/platforms/tile_middle.png',
    './images/platforms/tile_middle.png',
    './images/platforms/tile_middle.png',
    './images/platforms/tile_middle.png',
  ],
  groundY: 500,
  spawnTimer: 0,

  drawBack(source = this.layers[0], y = 0) {
    let img = new Image();
    img.src = source;

    ctx.drawImage(img, this.x + canvas.width, y, canvas.width, canvas.height);
    ctx.drawImage(img, this.x, y, canvas.width, canvas.height);
  },

  drawFront(deltaTime) {
    //draw front parte if there's one
    if (this.layers.length > 1) {
      this.drawBack(this.layers[1], 0);
    }

    if (this.raining) {
      rain.makeRain(deltaTime);

      if (rainSound.sound.paused) {
        rainSound.play();
      }
    }
  },

  move() {
    if (this.x >= 0 && this.speed < 0) {
      this.speed = 0;
    }

    if (this.speedAcumulator >= 8500 && this.speed > 0) {
      this.speed = 0;
    }

    this.speedAcumulator += this.speed;
    this.x -= this.speed;
    //this.speed = 0;
    this.x %= canvas.width;
  },

  updateLevel(deltaTime) {
    this.spawnTimer += deltaTime;

    this.move();
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBack();

    //update platforms
    for (const platform of this.platforms) {
      platform.draw();
    }

    //update traps
    for (const trap of this.traps) {
      trap.draw(deltaTime);
      if (trap.x < 1920 && trap.x > 0) {
        if (sawSound.sound.currentTime > 1.98) {
          sawSound2.play();
        }
        if (sawSound.sound.paused) {
          sawSound.play();
        }
      }
      trap.hitPlayer();
    }

    //update collectors
    for (let i = 0; i < this.collectors.length; i++) {
      this.collectors[i].updateCollector(deltaTime);
      if (this.collectors[i].hitPlayer()) {
        this.collectors.splice(i, 1);
        hpPlusSound.play();
      }
    }

    //update enemies or remove them if they 'escaped' and are out of sight
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].x < -500 && this.enemies[i].lookingRight === false) {
        this.enemies.splice(i, 1);
      } else if (this.enemies[i].x > canvas.width + 1500 && this.enemies[i].lookingRight) {
        this.enemies.splice(i, 1);
      } else {
        this.enemies[i].updateEnemy(deltaTime);
      }
    }

    //update dead enemies
    for (const enemy of this.enemiesToRemove) {
      enemy.updateEnemy(deltaTime);
    }

    if (this.remainingRobots > 0) {
      //create enemies
      if (this.spawnTimer >= this.spawnCooldown) {
        this.spawnTimer = 0;
        this.remainingRobots--;
        this.enemies.push(new Robot());
      }
    }

    //put the boss on the map
    if (this.speedAcumulator >= 7000 && this.bossSpawned === false) {
      this.bossSpawned = true;
      currentGame.message('BOSS BATTLE  -  S U P E R   R O B O T');
      this.enemies.push(new Boss(currentLevel));

      const laughAfterSpace = setInterval(() => {
        if (!controller.pause) {
          bossLaugh.play();
          clearInterval(laughAfterSpace);
        }
      }, 100);

      cancelAnimationFrame(request);
      return;
    }

    //update bombs
    for (let i = 0; i < level.bombs.length; i++) {
      level.bombs[i].updateBomb(deltaTime);
      if (
        level.bombs[i].hitPlayer() ||
        (level.bombs[i].x > canvas.width && level.bombs[i].leftOrRight === false) ||
        (level.bombs[i].x < 0 && level.bombs[i].leftOrRight) ||
        level.bombs[i].y > canvas.height
      ) {
        level.bombs.splice(i, 1);
      }
    }
    levelLastSpeed = this.speed;
    this.speed = 0;
  },
};
