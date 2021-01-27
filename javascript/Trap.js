class Trap {
    constructor(source, x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.animation = new ObjAnimation(3, source, 356, 361);
        this.damageValue = 3;
        this.canDamage = true;
        this.speed = 1;
        this.changePosCounter = 0;
    }

    left() { return this.x + 15;}
    right() { return this.x + this.width - 15;}
    top() { return this.y + 10; }
    bottom() { return this.y + this.height - 10; }

    draw() {
        this.x = this.x - level.speed;
        this.y += this.speed;

        if(this.changePosCounter % 100 === 0) {
            this.speed = this.speed * -1;
            this.changePosCounter = 1;
        }
        this.changePosCounter++;

        this.animation.animate(true, false, this.x, this.y, this.width, this.height, 3); //cols
    }

    updateSaw() {
        this.draw();
    }

    hitPlayer() {
        let colliding = false;
        colliding = ! (this.bottom() < currentGame.player.top() ||
        this.top() > currentGame.player.bottom() ||
        this.right() < currentGame.player.left() ||
        this.left() > currentGame.player.right());

        if(colliding) {
            boomSound.play();
            currentGame.player.receiveDmg(this.damageValue);
            currentGame.player.x -= 200;
            if(currentGame.player.health <= 0) {
                currentGame.hasEnded = true;
            }
            return colliding; //if colliding the bullet will be removed in the player move()
        }
    }
}