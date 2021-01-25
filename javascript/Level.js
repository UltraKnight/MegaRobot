const level = {
    layers: [
        './images/levels/level-1/level-1.png',
        './images/levels/level-1/level-1-front.png'
    ],
    x: 0,
    speed: 0,
    speedAcumulator: 0, //used to make other resources scroll with the level
    newEnemyTimer: 0,
    enemies: [],
    maxRobots: 20,
    remainingRobots: 20,
    traps: [],
    platforms: [],
    groundY: 500,

    drawBack(source = this.layers[0], y = 0) {
        let img = new Image();
        img.src = source;

        ctx.drawImage(img, this.x + canvas.width, y, canvas.width, canvas.height);
        ctx.drawImage(img, this.x, y, canvas.width, canvas.height);
    },

    drawFront() {
        this.drawBack(this.layers[1], 0);
    },

    move() {
         if(this.x >= 0 && this.speed < 0) {
             this.speed = 0;
         }

         if(this.x <= -8500 && this.speed > 0) {
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
        
        //update enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].updateEnemy();
        }

        if(this.remainingRobots > 0) {
            //create enemies
            if(this.newEnemyTimer % 300 === 0) {
                this.remainingRobots--;
                this.newEnemyTimer = 0;
                this.enemies.push(new Robot());
            }
            this.newEnemyTimer++;
        }

        this.speed = 0;
    },
};