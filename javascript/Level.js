const level = {
    layers: [
        './images/levels/level-1/level-1.png',
        './images/levels/level-1/level-1-front.png'
    ],
    x: 0,
    speed: 0,
    speedAcumulator: 0, //used to make other resources scroll with the level
    newEnemyTimer: 0,
    spawnTimer: 250,
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
        [6000, 600, 'rapid-s', 300, 300, 6]
    ], //x, y, animation width, animation height
    collectorsSrc: [
        `./images/collectors/hp/hp-plus.png`,
        `./images/collectors/super-shot/super-bonus.png`,
        `./images/collectors/rapid-s/rapid-s.png`
    ],
    trapsPos: [[300, 600], [3335, 540], [6000, 630], [6500, 630]],
    trapsSrc: [
        `./images/levels/traps/saw/saw.png`,
        `./images/levels/traps/saw/saw.png`,
        `./images/levels/traps/saw/saw.png`,
        `./images/levels/traps/saw/saw.png`,
    ],
    platforms: [],
    platformsPos: [[500, 460], [700, 490], [1200, 570], [3270, 550], [4000, 560]],
    platformsSrc: [
        './images/platforms/tile_middle.png',
        './images/platforms/tile_middle.png',
        './images/platforms/tile_middle.png',
        './images/platforms/tile_middle.png',
        './images/platforms/tile_middle.png'
    ],
    groundY: 500,

    drawBack(source = this.layers[0], y = 0) {
        let img = new Image();
        img.src = source;

        ctx.drawImage(img, this.x + canvas.width, y, canvas.width, canvas.height);
        ctx.drawImage(img, this.x, y, canvas.width, canvas.height);
    },

    drawFront() {
        //draw front parte if there's one
        if (this.layers.length > 1) {
            this.drawBack(this.layers[1], 0);
        }

        if(this.raining) {
            rain.makeRain();

            if(rainSound.sound.paused) {
                rainSound.play();
            }
        }
    },

    move() {
         if(this.x >= 0 && this.speed < 0) {
             this.speed = 0;
         }

         if(this.speedAcumulator >= 8500 && this.speed > 0) {
             this.speed = 0;
         }

        this.speedAcumulator += this.speed;
        this.x -= this.speed;
        //this.speed = 0;
        this.x %= canvas.width;
    },

    updateLevel() {
        this.move();
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBack();
        
        //update platforms
        for (let i = 0; i < this.platforms.length; i++) {
            this.platforms[i].draw();
        }

        //update traps
        for (let i = 0; i < this.traps.length; i++) {
            this.traps[i].draw();
            if(this.traps[i].x < 1920 && this.traps[i].x > 0) {
                if(sawSound.sound.currentTime > 1.98) {
                    sawSound2.play();
                }
                if (sawSound.sound.paused) {
                    sawSound.play();
                }
            }
            this.traps[i].hitPlayer();
        }

        //update collectors
        for (let i = 0; i < this.collectors.length; i++) {
            this.collectors[i].updateCollector();
            if(this.collectors[i].hitPlayer()) {
                this.collectors.splice(i, 1);
                hpPlusSound.play();
            }
        }

        //update enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].updateEnemy();
        }

        //update dead enemies
        for (let i = 0; i < this.enemiesToRemove.length; i++) {
            this.enemiesToRemove[i].updateEnemy();   
        }

        if(this.remainingRobots > 0) {
            //create enemies
            if(this.newEnemyTimer % this.spawnTimer === 0) {
                this.remainingRobots--;
                this.newEnemyTimer = 0;
                this.enemies.push(new Robot());
            }
            this.newEnemyTimer++;
        }

        //put the boss on the map
        if(this.speedAcumulator >= 7000 && this.bossSpawned === false) {
            this.bossSpawned = true;
            currentGame.message("BOSS BATTLE  -  S U P E R   R O B O T");
            this.enemies.push(new Boss(currentLevel));

            const laughAfterSpace = setInterval(() => {
                if (! controller.pause) {
                    bossLaugh.play();
                    clearInterval(laughAfterSpace);
                }
            }, 100);

            cancelAnimationFrame(request);
            return;
        }

        //update bombs
        for (let i = 0; i < level.bombs.length; i++) {
            level.bombs[i].updateBomb();
            if(level.bombs[i].hitPlayer() || level.bombs[i].x > canvas.width || level.bombs[i].x < 0 ||
             level.bombs[i].y > canvas.height) {
                level.bombs.splice(i, 1);
            }
        }
        levelLastSpeed = this.speed;
        this.speed = 0;
    }
};