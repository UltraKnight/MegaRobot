class Trap {
    constructor(source, x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.animation = new ObjAnimation(3, source, 356, 361);
        this.damageValue = 3;
        this.canDamage = true;
    }

    left() { return this.x + 10;}
    right() { return this.x + this.width - 10;}
    top() { return this.y; }
    bottom() { return this.y + this.height; }

    draw() {
        this.x = this.x - level.speed;
        this.animation.animate(true, false, this.x, this.y, this.width, this.height, 3); //cols
    }

    updateSaw() {
        this.draw();
    }

    hitPlayer() {
        let colliding = false;
        for (let i = 0; i < level.enemies.length; i++) {
            colliding = ! (this.bottom() < currentGame.player.top() ||
            this.top() > currentGame.player.bottom() ||
            this.right() < currentGame.player.left() ||
            this.left() > currentGame.player.right());

            if(colliding) {
                currentGame.player.receiveDmg(this.damageValue);
                currentGame.player.x -= 100;
                if(currentGame.player.health <= 0) {
                    currentGame.hasEnded = true;
                }
                return colliding; //if colliding the bullet will be removed in the player move()
            }
        }
    }
}