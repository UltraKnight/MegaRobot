class Bomb {
    constructor(x, y, speed, rightOrLeft) {
        this.x = x;
        this.speed = -10;
        this.y = y;
        
        //this.animation = new ObjAnimation(5, `./images/player/bullet/bullet.png`, 170, 139);
        this.animation = new ObjAnimation(2, `./images/enemies/bomb/bomb.png`, 250, 326);
        this.exploding = new ObjAnimation(8, `./images/enemies/bomb-exploding/exploding.png`, 298, 298);
        this.width = 50;
        this.height = 50;
        this.damageValue = 2;
        this.goUp = 100;
        this.rightOrLeft = rightOrLeft;
        this.canDamage = true;
    }

    left() { return this.x; }
    right() { return this.x + this.width - 5; }
    top() { return this.y; }
    bottom() { return this.y + this.height - 5; }

    draw() {
        if(this.goUp === 10) {
            boomSound.play();
        }
        if(this.goUp <= 10) {
            this.exploding.animate(true, this.rightOrLeft, this.x, this.y, this.width, this.height, 3);
        } else {
            this.animation.animate(true, this.rightOrLeft, this.x, this.y, this.width, this.height, 1); //cols ??
        }
    }

    move() {
        this.x += this.speed - level.speed;
        if(this.goUp > 60) {
            this.y -= 4;
        } else if(this.goUp > 40) {
            this.y -= 2;
        } else {
            this.y += 3;
        }

        if(this.goUp > 0) {
            this.goUp--;
        }
    }

    hitPlayer() {
        let colliding = false;
        for (let i = 0; i < level.enemies.length; i++) {
            colliding = ! (this.bottom() < currentGame.player.top() ||
            this.top() > currentGame.player.bottom() ||
            this.right() < currentGame.player.left() ||
            this.left() > currentGame.player.right());

            if(colliding) {
                if(this.canDamage) {
                    currentGame.player.receiveDmg(this.damageValue);
                    boomSound.play();
                    this.canDamage = false;
                }
                if(currentGame.player.health <= 0) {
                    currentGame.hasEnded = true;
                }
                return colliding; //if colliding the bullet will be removed in the player move()
            }
        }
    }

    updateBomb() {
        this.move();
        this.draw();
    }
}